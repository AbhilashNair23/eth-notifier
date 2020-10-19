<p align="center">
  <a href="#"><img src="./box-img-sm.png" alt="Logo" /></a>
</p>

# ETH Amount Notifier

**Pre-Requisites**
1. [NodeJS](https://nodejs.org/)
2. [NestJS](https://nestjs.com/)
3. [GanacheCLI](https://github.com/trufflesuite/ganache-cli)
4. [Truffle](https://github.com/trufflesuite/truffle)

**Installation**
1. Install Truffle, Ganache CLI and NestJS globally. If you prefer, the graphical version of Ganache works as well!
```
npm install -g truffle
npm install -g ganache-cli
npm install -g @nestjs/cli
```

2. Run the ganache-cli.
```
ganache-cli
```

3. Now these contracts need to be compiled and deployed on the Blockchain. For this, run `truffle migrate` inside project root directory. 
4. You can see that a new `/build` folder has been created in the root directory which contains the compiled contracts.
5. To run the Node server `npm start`.
6. Server will be available on `http://localhost:3000/`.
7. There will be 3 API endpoints available and its details are:
```
http://localhost:3000/accounts : To get available account details
http://localhost:3000/balance/(address) : To get balance of requested address. Pass the address as param.
http://localhost:3000/transaction:  : To send the ether from one account to another. Pass the from address and to address in heeaders. If we need to mention transaction amount, add the amount as header otherwise it will taken from environment file.
```


