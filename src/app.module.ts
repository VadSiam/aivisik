import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, CronService],
})
export class AppModule {}
