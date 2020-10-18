import { Get, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import Web3 from 'web3';

@Injectable()
export class AppService {

  constructor(
    private readonly configService: ConfigService,
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
    return await web3.eth.sendTransaction({ from, to, value: web3.utils.toWei(transactionAmount, this.configService.get('CURRENCY')), data: web3.utils.toHex('send ether') })
  }
}
