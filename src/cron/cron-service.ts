import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppService } from 'src/app.service';
import { NotificationService } from 'src/common/notification.service';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly notificationService: NotificationService,
        private readonly appService: AppService,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    async dailyUpdateCron(): Promise<any> {
        if (this.configService.get('REGISTERED_ADDRESS')) {
            this.logger.debug('Called at 9 AM');
            await this.appService.triggerNotification(this.configService.get('REGISTERED_ADDRESS'));
        }
    }

    @Cron(CronExpression.EVERY_SECOND)
    async registeredAddressBalanceCheckCron(): Promise<any> {
        if (this.configService.get('REGISTERED_ADDRESS')) {
            await this.appService.minimumBalanceNotifier(this.configService.get('REGISTERED_ADDRESS'));
        }
    }
}