import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class HealthService {
  checkHealth() {
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
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }
}

