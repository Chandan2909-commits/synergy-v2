import { Injectable, Optional } from '@nestjs/common';
import * as os from 'os';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class HealthService {
  constructor(@Optional() private readonly redisService?: RedisService) {}

  async checkHealth() {
    let redisInfo: any = { status: 'disabled' };
    if (this.redisService) {
      const isPingOk = await this.redisService.ping();
      redisInfo = {
        status: isPingOk ? 'connected' : 'degraded',
        mode: this.redisService.getMode(),
      };
    }

    return {
      status: 'healthy',
      app: 'Synergy API Engine',
      version: '1.0.0',
      uptime: process.uptime(),
      memory: {
        totalMemMb: Math.round(os.totalmem() / (1024 * 1024)),
        freeMemMb: Math.round(os.freemem() / (1024 * 1024)),
        heapUsedMb: Math.round(process.memoryUsage().heapUsed / (1024 * 1024)),
      },
      redis: redisInfo,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }
}
