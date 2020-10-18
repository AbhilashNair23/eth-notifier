import { Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) { }

  @Get("/balance/:address")
  async getBalance(@Param('address') address: string): Promise<any> {
    return await this.appService.getBalance(address);
  }

  @Get('/accounts')
  async getAccounts(): Promise<any> {
    return await this.appService.getAccounts();
  }

  @Post('/transaction')
  async send(@Headers('from') from: string, @Headers('to') to: string, @Headers('amount') amount?: string): Promise<any> {
    return await this.appService.send(from, to, amount);
  }

}
