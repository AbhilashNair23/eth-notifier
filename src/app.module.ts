import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationService } from './common/notification.service';
import { CronService } from './cron/cron-service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService, CronService, NotificationService],
})
export class AppModule { }
