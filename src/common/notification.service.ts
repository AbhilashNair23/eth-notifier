import { HttpService, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) { }

    async notifyCurrentBalance(message: any): Promise<any> {
        const url = this.configService.get('SLACK_URL');
        try {
            const response = await this.httpService.post<any>(
                url,
                message, {
                headers: {
                    'Content-type': 'application/json',
                },
            }).toPromise();
            this.logger.debug(response.data);
            return {
                status: HttpStatus.OK,
                data: response.data
            }
        } catch (e) {
            this.logger.debug(e.message);
        }

    }
}