const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");
const fs = require("fs");

// const mnemonic = fs.readFileSync('.secret').toString().trim()
// const infuraKey = fs.readFileSync('.infuraKey').toString()

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    contracts_build_directory: path.join(__dirname, "app/src/contracts"),
    networks: {
        develop: {
            // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
            host: "127.0.0.1",
            port: 7545,
            network_id: "*"
        }
        // // Useful for deploying to a public network.
        // // NB: It's important to wrap the provider as a function.
        // ropsten: {
        //   provider: () =>
        //     new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraKey}`),
        //   network_id: 3, // Ropsten's id
        //   gas: 5500000, // Ropsten has a lower block limit than mainnet
        //   confirmations: 2, // # of confs to wait between deployments. (default: 0)
        //   timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
        //   skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
        // },
    },
    mocha: {
        timeout: 1000
    }
};
