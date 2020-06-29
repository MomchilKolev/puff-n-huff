# Libraries used

## Recoil

State management

## @truffle/hdwallet-provider

HD Wallet-enabled Web3 provider

## Web3

Ethereum JavaScript API

## React, ReactDOM and React-router-dom and node-sass

Frontend

## Metamask and Ganache

# How to run

## Required packages

-   Ganache locally running
-   Metamask connected to Ganache

1. git clone https://github.com/MomchilKolev/puff-n-huff
2. cd puff-n-huff
3. npm i
4. cd app
5. npm i
6. start ganache locally
7. edit truffle-config.js to connect to ganache

-   example with ganache gui running on HTTP://127.0.0.1:7545
    ```
    module.exports = {
      // See <http://truffleframework.com/docs/advanced/configuration>
      // to customize your Truffle configuration!
      contracts_build_directory: path.join(__dirname, "app/src/contracts"),
      networks: {
        develop: { // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
          host: "127.0.0.1",
          port: 7545,
          network_id: "*"
        }
      },
      mocha: {
        timeout: 1000
      }
    };
    ```

8. truffle compile
9. truffle migrate
10. copy the contract address and place it in ./app/src/state/contractAddress.js like so `export default "0x312564231CCf7AAec2745F23A71B8Ac692832a43
11. cd app
12. npm start
