import { Injectable, OnModuleInit, OnModuleDestroy, Logger, Optional } from '@nestjs/common';
import { PublishingService } from './publishing.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PublishingScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PublishingScheduler.name);
  private intervalTimer?: NodeJS.Timeout;
  private isProcessing = false;

  constructor(
    private readonly publishingService: PublishingService,
    @Optional() private readonly redisService?: RedisService,
  ) {}

  async onModuleInit() {
    this.logger.log('Publishing Scheduler initialized with distributed lock support.');
    // Initial recovery tick
    await this.tick();

    // Active worker loop every 5 seconds
    this.intervalTimer = setInterval(() => {
      this.tick();
    }, 5000);
  }

  onModuleDestroy() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.logger.log('Publishing Scheduler timer stopped.');
    }
  }

  private async tick() {
    if (this.isProcessing) return;

    let lockToken: string | null = null;
    if (this.redisService) {
      lockToken = await this.redisService.acquireLock('publishing-tick', 12);
      if (!lockToken) {
        // Another worker instance holds the lock
        return;
      }
    }

    this.isProcessing = true;
    try {
      const res = await this.publishingService.processDuePosts();
      if (res.processedCount > 0) {
        this.logger.log(
          `Processed ${res.processedCount} due publishing jobs (${res.successfulCount} success, ${res.failedCount} retry/failed)`
        );
      }
    } catch (err: any) {
      this.logger.error(`Scheduler tick error: ${err.message}`);
    } finally {
      this.isProcessing = false;
      if (this.redisService && lockToken) {
        await this.redisService.releaseLock('publishing-tick', lockToken);
      }
    }
  }
}
