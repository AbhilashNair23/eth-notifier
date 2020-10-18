import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    @Cron(CronExpression.EVERY_HOUR)
    async handleCron(): Promise<any> {
        this.logger.debug('Called in every second');
        const url = this.configService.get('SLACK_URL');
        const message = { "text": "Hello, World!" };
        const response = await this.httpService.post<any>(
            url,
            message, {
            headers: {
                'Content-type': 'application/json',
            },
        }).toPromise();
        this.logger.debug(response.data);
    }
}