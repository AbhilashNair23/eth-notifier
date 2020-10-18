import { Get, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from './common/notification.service';
// import Web3 from 'web3';

@Injectable()
export class AppService {

  constructor(
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
  ) { }

  async getBalance(address: string): Promise<any> {
    let balance: any;
    const Web3 = require('web3');
    const web3 = new Web3(new Web3.providers.HttpProvider(this.configService.get('PROVIDER')))
    const ethBalance = await web3.eth.getBalance(address);
    balance = web3.utils.fromWei(ethBalance, this.configService.get('CURRENCY')) + ' ' + this.configService.get('CURRENCY_CODE');
    return {
      status: HttpStatus.OK,
      address,
      balance,
    }
  }

  async getAccounts(): Promise<any> {
    const Web3 = require('web3');
    const web3 = new Web3(new Web3.providers.HttpProvider(this.configService.get('PROVIDER')))
    let accounts = await web3.eth.getAccounts()
    return accounts;
  }

  async send(from: string, to: string, amount?: string): Promise<any> {
    const Web3 = require('web3');
    const web3 = new Web3(new Web3.providers.HttpProvider(this.configService.get('PROVIDER')))
    const transactionAmount = (amount !== undefined) ? amount : this.configService.get('TRANSACTION_AMOUNT');
    await this.triggerNotification(from, amount);
    return await web3.eth.sendTransaction({ from, to, value: web3.utils.toWei(transactionAmount, this.configService.get('CURRENCY')), data: web3.utils.toHex('send ether') })
  }

  async triggerNotification(from: string, amount: string): Promise<any> {
    const currentBalance = await this.getBalance(from);
    const message = {
      'text': '\n' + 'Transaction Summary' + '\n' + 'Account Address : ' + from + '\n' + 'Transaction Amount : ' + amount + '\n ' + 'Current Balance : ' + currentBalance.balance
    };
    await this.notificationService.notifyCurrentBalance(message);
  }
}
