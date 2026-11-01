import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { TenantGuard } from '../../common/guards/tenant.guard';

@Module({
  imports: [PrismaModule],
  controllers: [CalendarController],
  providers: [CalendarService, TenantGuard],
  exports: [CalendarService],
})
export class CalendarModule {}
