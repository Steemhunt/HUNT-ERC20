/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    ropsten: {
      provider: new HDWalletProvider(process.env.DEV_PRIVATE_KEY, `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`),
      network_id: 3,
      gas: 4500000,
      gasPrice: 2.1 * 10**9 // 2.1 GWei
    },
    mainnet: {
      provider: new HDWalletProvider(process.env.MAINNET_HOT_PRIVATE_KEY, `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`),
      network_id: 1,
      gas: 4500000,
      gasPrice: 2.1 * 10**9 // 2.1 GWei
    },
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: '*'
    },
  }
};
