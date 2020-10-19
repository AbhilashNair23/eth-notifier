import { Get, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from './common/notification.service';

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

  async etherTransaction(from: string, to: string, amount?: string): Promise<any> {
    const Web3 = require('web3');
    const web3 = new Web3(new Web3.providers.HttpProvider(this.configService.get('PROVIDER')))
    const fromAddressBalance = await this.getBalance(from);
    const transactionAmount = (amount !== undefined) ? amount : this.configService.get('TRANSACTION_AMOUNT');
    let response;
    if (Number(fromAddressBalance.balance.toString().split(' ')[0]) > Number(transactionAmount)) {
      response = await web3.eth.sendTransaction({ from, to, value: web3.utils.toWei(transactionAmount, this.configService.get('CURRENCY')), data: web3.utils.toHex('send ether') })
      await this.triggerNotification(from, amount);
    } else {
      response = {
        status: HttpStatus.EXPECTATION_FAILED,
        error: 'Balance insufficient!!'
      }
    }
    return response;
  }

  async triggerNotification(from: string, amount?: string): Promise<any> {
    const currentBalance = await this.getBalance(from);
    let message;
    if (amount !== undefined) {
      message = {
        'text': '\n' + 'Transaction Summary' + '\n' + 'Account Address : ' + from + '\n' + 'Transaction Amount : ' + amount + '\n ' + 'Current Balance : ' + currentBalance.balance
      };
    } else {
      message = {
        'text': '\n' + 'Transaction Summary' + '\n' + 'Account Address : ' + from + '\n' + 'Current Balance : ' + currentBalance.balance
      };
    }
    await this.notificationService.notifyMessage(message);
  }

  async minimumBalanceNotifier(from: string): Promise<any> {
    const currentBalance = await this.getBalance(from);
    let message;
    if (Number(currentBalance.balance.toString().split(' ')[0]) < Number(this.configService.get('MINIMUM_BALANCE'))) {
      message = {
        'text': '\n' + 'Low balance alert!!!' + '\n' + 'Account Address : ' + from + '\n' + 'Current Balance : ' + currentBalance.balance
      };
      await this.notificationService.notifyMessage(message);
    }
  }
}
