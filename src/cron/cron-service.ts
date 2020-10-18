import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from 'src/common/notification.service';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly notificationService: NotificationService,
    ) { }

    @Cron(CronExpression.EVERY_HOUR)
    async handleCron(): Promise<any> {
        this.logger.debug('Called in every second');
        const message = { "text": "Welcome, World!" };
        await this.notificationService.notifyMessage(message);
    }
}