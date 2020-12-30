const { assert } = require('chai')
const { newDao, newApp } = require('./helpers/dao')
const { assertBn, assertRevert, assertEvent } = require('@aragon/contract-helpers-test/src/asserts')
const { bn } = require('@aragon/contract-helpers-test')
const { default: Web3 } = require('web3')
const { getWeb3 } = require('@aragon/contract-helpers-test/src/config/web3')

const LidoOracle = artifacts.require('LidoOracleMock.sol')
const EncoderTest = artifacts.require('EncoderTest.sol')
const DelegateProxy = artifacts.require('MyDelegateProxy.sol')

contract('LidoOracle', ([appManager, voting, user1, user2, user3, user4, nobody]) => {
  let appBase, app, proxyAddress

  describe('', function () {
    this.timeout(100000)

    before(async () => {
      appBase = await LidoOracle.new()
    })

    beforeEach('deploy dao and app', async () => {
      await this.timeout(100000)
      const { dao, acl } = await newDao(appManager)

      // Instantiate a proxy for the app, using the base contract as its logic implementation.
      proxyAddress = await newApp(dao, 'lidooracle', appBase.address, appManager)
      app = await LidoOracle.at(proxyAddress)
      console.log(proxyAddress)
      console.log(app.address)

      // Set up the app's permissions.
      await acl.createPermission(voting, app.address, await app.MANAGE_MEMBERS(), appManager, { from: appManager })
      await acl.createPermission(voting, app.address, await app.MANAGE_QUORUM(), appManager, { from: appManager })
      await acl.createPermission(voting, app.address, await app.SET_BEACON_SPEC(), appManager, { from: appManager })

      // Initialize the app's proxy.
      await app.initialize('0x0000000000000000000000000000000000000000', 1, 32, 12, 1606824000)
    })

    describe('', function () {
      beforeEach(async () => {
        await app.setTime(1606824000)
        await app.addOracleMember(user1, { from: voting })
        assertBn(await app.getQuorum(), 1)
      })

      it('test funs work', async () => {
        console.log(web3.version)
        oracle = new web3.eth.Contract(LidoOracle.abi, proxyAddress)
        txn_data = oracle.methods.getLastPushedFrame().encodeABI()
        console.log(txn_data)
        result = await web3.eth.call({ value: 0, gas: 100000, gasPrice: 1, to: proxyAddress, data: txn_data })
        console.log(result)
      })
      /*
    it('getCurrentFrame works', async () => {
      console.log(await app.getCurrentFrame())
      await app.reportBeacon(0, 32, 1, { from: user1 })
      console.log(await app.getCurrentFrame())
    })

    it('getLastPushedFrame works', async () => {
      console.log(await app.getLastPushedFrame())
      await app.reportBeacon(0, 32, 1, { from: user1 })
      console.log(await app.getLastPushedFrame())
    })

    it('getReportableFrames works', async () => {
      console.log(await app.getReportableFrames())
      await app.reportBeacon(0, 32, 1, { from: user1 })
      console.log(await app.getReportableFrames())
    })
    */
    })
  })
})

/*
contract('EncoderTest', ([acc]) => {
  let app_impl, app_proxy, app
  beforeEach('deploy base app', async () => {
    // Deploy the app's base contract.
    app_impl = await EncoderTest.new()
    app_proxy = await DelegateProxy.new()
    await app_proxy.setImpl(app_impl.address)
    assert.equal(await app_proxy.impl(), app_impl.address)
    app = await EncoderTest.at(app_proxy.address)
  })

  describe('', function () {
    it('test1 works', async () => {
      console.log(await app.test1(1))
    })

    it('test2 works', async () => {
      console.log(await app.test2(1))
    })

    it('test1 raw works', async () => {
      enc = new web3.eth.Contract(EncoderTest.abi, app_proxy.address)
      txn_data = enc.methods.test1(1).encodeABI()
      console.log(txn_data)
      result = await web3.eth.call({'to': app_proxy.address, 'data': txn_data})
      console.log(result)
    })
  })
})
*/
