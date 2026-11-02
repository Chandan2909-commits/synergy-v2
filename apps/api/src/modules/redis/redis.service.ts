import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import IORedis, { Redis as IORedisClient } from 'ioredis';
import { Redis as UpstashRestClient } from '@upstash/redis';

export type RedisClientMode = 'upstash-rest' | 'ioredis' | 'memory';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private mode: RedisClientMode = 'memory';
  private ioRedisClient?: IORedisClient;
  private upstashRestClient?: UpstashRestClient;
  private memoryStore = new Map<string, { value: any; expiresAt?: number }>();
  private isReady = false;

  async onModuleInit() {
    await this.initClient();
  }

  async onModuleDestroy() {
    if (this.ioRedisClient) {
      try {
        await this.ioRedisClient.quit();
        this.logger.log('IORedis connection closed gracefully.');
      } catch (err: any) {
        this.logger.warn(`Error closing IORedis: ${err.message}`);
      }
    }
  }

  private async initClient() {
    const restUrl = process.env.UPSTASH_REDIS_REST_URL;
    const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_URL;

    // 1. Check if Upstash REST credentials are provided
    if (restUrl && restToken) {
      try {
        this.upstashRestClient = new UpstashRestClient({
          url: restUrl,
          token: restToken,
        });
        await this.upstashRestClient.ping();
        this.mode = 'upstash-rest';
        this.isReady = true;
        this.logger.log(`Connected to Upstash Redis via HTTP REST (${restUrl})`);
        return;
      } catch (err: any) {
        this.logger.warn(`Failed connecting to Upstash REST: ${err.message}. Checking TCP connection...`);
      }
    }

    // 2. Check if REDIS_URL (or UPSTASH_REDIS_URL) is provided (rediss:// or redis://)
    if (redisUrl && redisUrl !== 'redis://localhost:6379') {
      try {
        const isTls = redisUrl.startsWith('rediss://');
        this.ioRedisClient = new IORedis(redisUrl, {
          tls: isTls ? {} : undefined,
          maxRetriesPerRequest: 2,
          connectTimeout: 7000,
          retryStrategy: (times) => {
            if (times > 3) {
              this.logger.warn('Redis reconnection retries exhausted; switching to in-memory fallback.');
              this.mode = 'memory';
              return null;
            }
            return Math.min(times * 200, 2000);
          },
        });

        this.ioRedisClient.on('connect', () => {
          this.mode = 'ioredis';
          this.isReady = true;
          this.logger.log(`Connected to Redis via standard TCP (${isTls ? 'TLS Encrypted' : 'Plaintext'})`);
        });

        this.ioRedisClient.on('error', (err) => {
          this.logger.warn(`Redis TCP error: ${err.message}`);
        });

        await this.ioRedisClient.ping();
        this.mode = 'ioredis';
        this.isReady = true;
        return;
      } catch (err: any) {
        this.logger.warn(`Could not connect to Redis TCP: ${err.message}. Using resilient memory fallback.`);
      }
    }

    // 3. Fallback to resilient in-memory store
    this.mode = 'memory';
    this.isReady = true;
    this.logger.log('Redis initialized in resilient in-memory fallback mode (No external REDIS_URL or Upstash REST credentials provided).');
  }

  getMode(): RedisClientMode {
    return this.mode;
  }

  isHealthy(): boolean {
    return this.isReady;
  }

  async ping(): Promise<boolean> {
    try {
      if (this.mode === 'upstash-rest' && this.upstashRestClient) {
        const res = await this.upstashRestClient.ping();
        return res === 'PONG';
      }
      if (this.mode === 'ioredis' && this.ioRedisClient) {
        const res = await this.ioRedisClient.ping();
        return res === 'PONG';
      }
      return true;
    } catch {
      return false;
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      if (this.mode === 'upstash-rest' && this.upstashRestClient) {
        const data = await this.upstashRestClient.get<T>(key);
        return data ?? null;
      }
      if (this.mode === 'ioredis' && this.ioRedisClient) {
        const str = await this.ioRedisClient.get(key);
        if (!str) return null;
        try {
          return JSON.parse(str) as T;
        } catch {
          return str as unknown as T;
        }
      }
    } catch (err: any) {
      this.logger.warn(`Redis get error for ${key}: ${err.message}`);
    }

    // Memory fallback
    const item = this.memoryStore.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.memoryStore.delete(key);
      return null;
    }
    return item.value as T;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      if (this.mode === 'upstash-rest' && this.upstashRestClient) {
        if (ttlSeconds && ttlSeconds > 0) {
          await this.upstashRestClient.set(key, value, { ex: ttlSeconds });
        } else {
          await this.upstashRestClient.set(key, value);
        }
        return;
      }
      if (this.mode === 'ioredis' && this.ioRedisClient) {
        const valStr = typeof value === 'string' ? value : JSON.stringify(value);
        if (ttlSeconds && ttlSeconds > 0) {
          await this.ioRedisClient.set(key, valStr, 'EX', ttlSeconds);
        } else {
          await this.ioRedisClient.set(key, valStr);
        }
        return;
      }
    } catch (err: any) {
      this.logger.warn(`Redis set error for ${key}: ${err.message}`);
    }

    // Memory fallback
    this.memoryStore.set(key, {
      value,
      expiresAt: ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : undefined,
    });
  }

  async del(key: string): Promise<void> {
    try {
      if (this.mode === 'upstash-rest' && this.upstashRestClient) {
        await this.upstashRestClient.del(key);
        return;
      }
      if (this.mode === 'ioredis' && this.ioRedisClient) {
        await this.ioRedisClient.del(key);
        return;
      }
    } catch (err: any) {
      this.logger.warn(`Redis del error for ${key}: ${err.message}`);
    }

    this.memoryStore.delete(key);
  }

  async incr(key: string): Promise<number> {
    try {
      if (this.mode === 'upstash-rest' && this.upstashRestClient) {
        return await this.upstashRestClient.incr(key);
      }
      if (this.mode === 'ioredis' && this.ioRedisClient) {
        return await this.ioRedisClient.incr(key);
      }
    } catch (err: any) {
      this.logger.warn(`Redis incr error for ${key}: ${err.message}`);
    }

    const current = (await this.get<number>(key)) || 0;
    const next = current + 1;
    await this.set(key, next);
    return next;
  }

  /**
   * Acquire a distributed lock.
   * Returns a unique token string if acquired, or null if lock is held by another process.
   */
  async acquireLock(lockKey: string, ttlSeconds: number = 30): Promise<string | null> {
    const token = `lock_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const fullKey = `synergy:lock:${lockKey}`;

    try {
      if (this.mode === 'upstash-rest' && this.upstashRestClient) {
        // Set if Not Exists with Expiry
        const res = await this.upstashRestClient.set(fullKey, token, { nx: true, ex: ttlSeconds });
        return res === 'OK' ? token : null;
      }
      if (this.mode === 'ioredis' && this.ioRedisClient) {
        const res = await this.ioRedisClient.set(fullKey, token, 'EX', ttlSeconds, 'NX');
        return res === 'OK' ? token : null;
      }
    } catch (err: any) {
      this.logger.warn(`AcquireLock error: ${err.message}`);
    }

    // Memory fallback
    const existing = this.memoryStore.get(fullKey);
    if (existing && (!existing.expiresAt || Date.now() < existing.expiresAt)) {
      return null;
    }
    this.memoryStore.set(fullKey, {
      value: token,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
    return token;
  }

  /**
   * Safely release a distributed lock only if held with the matching token.
   */
  async releaseLock(lockKey: string, token: string): Promise<boolean> {
    const fullKey = `synergy:lock:${lockKey}`;

    try {
      const currentToken = await this.get<string>(fullKey);
      if (currentToken === token) {
        await this.del(fullKey);
        return true;
      }
      return false;
    } catch (err: any) {
      this.logger.warn(`ReleaseLock error: ${err.message}`);
      return false;
    }
  }
}

