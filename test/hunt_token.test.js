const HuntToken = artifacts.require("./HuntToken");
const BigNumber = require('bignumber.js');

tokenSupply      = new BigNumber(500000000 * 10**18);
tokensForCompany = new BigNumber(150000000 * 10**18);
tokensForPrivate = new BigNumber(100000000 * 10**18);
tokensForAirdrop = new BigNumber(250000000 * 10**18);
huntPerEth = tokensForPrivate.dividedBy(2000); // HUNT per ETH

totalTokenSold = new BigNumber(0);
totalTokenAirdropped = new BigNumber(0);
tokensForBurn = new BigNumber(0);

contract('HuntToken test', async (accounts) => {
  let hunt;
  let adminInfo;
  // account: ETH
  const privateInvesters = {
    [accounts[1]]: new BigNumber(40), [accounts[2]]: new BigNumber(98), [accounts[3]]: new BigNumber(53), [accounts[4]]: new BigNumber(60),
    [accounts[5]]: new BigNumber(70), [accounts[6]]: new BigNumber(85), [accounts[7]]: new BigNumber(80), [accounts[8]]: new BigNumber(89),
    [accounts[9]]: new BigNumber(64), [accounts[10]]: new BigNumber(43), [accounts[11]]: new BigNumber(40), [accounts[12]]: new BigNumber(77),
    [accounts[13]]: new BigNumber(63), [accounts[14]]: new BigNumber(32), [accounts[15]]: new BigNumber(63), [accounts[16]]: new BigNumber(86),
    [accounts[17]]: new BigNumber(72), [accounts[18]]: new BigNumber(26), [accounts[19]]: new BigNumber(84), [accounts[20]]: new BigNumber(39)
  };
  // account: HUNT
  const airdropHunters = {};
  accounts.forEach(((account) => {
    if (accounts[0] !== account) {
      airdropHunters[account] = tokensForAirdrop.dividedBy(accounts.length)
    };
  }));

  let logBalance = async (hunt) => {
    currentSupply = await hunt.totalSupply.call();
    adminHunt = await hunt.balanceOf(accounts[0]);
    const adminEth = web3.eth.getBalance(accounts[0]);
    console.log(`====== Current Token Supply : ${currentSupply.valueOf()} | Admin Token : ${adminHunt.valueOf()} | Admin ETH : ${web3.fromWei(adminEth, 'ether')} | Tokens for burn : ${tokensForBurn}  ======`);
  };

  // Repeats beforeEach method before every describe method.
  beforeEach(async () => {
    hunt = await HuntToken.deployed();
    adminInfo = { gas: '4000000', from: accounts[0], gasPrice: '5' };
  });

  describe('basic tests', () => {
    it("Admin initially owns entire tokenSupply", async () => {
      let balance = await hunt.balanceOf.call(accounts[0]);
      let totalSupply = await hunt.totalSupply.call();
      assert.equal(balance.valueOf(), totalSupply)
    });
  });

  describe('private sale', () => {
    it("tests", async () => {
      logBalance(hunt);
      const promises = Object.entries(privateInvesters).map( async ([address, ether]) => {
        let huntBalanceBefore = await hunt.balanceOf.call(address);
        await web3.eth.sendTransaction({ from: address, to: accounts[0], value: web3.toWei(ether, 'ether'), gas: '4000000', gasPrice: '5' });
        const soldHunts = ether.times(huntPerEth);
        totalTokenSold = totalTokenSold.add(soldHunts);
        await hunt.transfer(address, soldHunts, adminInfo);
        let huntBalanceAfter = await hunt.balanceOf.call(address);
        assert.equal(huntBalanceAfter.valueOf(), soldHunts.add(huntBalanceBefore.valueOf()));
        return `${address}: purchased ${soldHunts} HUNT for ${ether} ETH`;
      });

      for (const promise of promises) {
        try {
          var msg = await promise;
          console.log(msg);
        } catch (error) {
          console.log(error, 'error');
        };
      };

      tokensForBurn = tokensForBurn.plus(tokensForPrivate.minus(totalTokenSold));
      logBalance(hunt);
    })
  })

  describe('airdrop', () => {
    it("tests", async () => {
      logBalance(hunt);
      const promises = Object.entries(airdropHunters).map( async ([address, token]) => {
        await hunt.transfer(address, token, adminInfo);
        receivedToken = await hunt.balanceOf(address);
        totalTokenAirdropped = totalTokenAirdropped.add(token);
        return `${address}: received ${receivedToken.valueOf()} HUNT airdrop`;
      });

      for (const promise of promises) {
        try {
          var msg = await promise;
          console.log(msg);
        } catch (error) {
          console.log(error, 'error');
        };
      };

      tokensForBurn = tokensForBurn.add(tokensForAirdrop.minus(totalTokenAirdropped));
      logBalance(hunt);
    });
  });

  describe('burn', () => {
    it("tests", async () => {
      logBalance(hunt);
      await hunt.burn(tokensForBurn, adminInfo);
      const totalSupply = await hunt.totalSupply.call();
      assert.equal(totalSupply.valueOf(), tokenSupply.minus(tokensForBurn));
      logBalance(hunt);
    });
  });

  describe('mint', () => {

    it("tests", async () => {
      logBalance(hunt);
      const beforeMint = await hunt.balanceOf(accounts[0]);
      tokensForMint = new BigNumber(100000 * 10**18);
      await hunt.mint(accounts[0], tokensForMint, adminInfo);
      const afterMint = await hunt.balanceOf(accounts[0]);
      assert.equal(afterMint.valueOf(), tokensForMint.add(parseFloat(beforeMint.valueOf())));
      logBalance(hunt);
    });

    it("test finished", async () => {
      logBalance(hunt);
    });
  });

});
