'use strict'

const assert = require('assert')
const {EthProvider} = require('../lib')._private

describe('EthProvider._call', () => {
    it('succeeded', async () => {
        let client = new EthProvider({
            endpoint: 'https://bsc-dataseed.binance.org'
        })
        let data = await client._call('eth_getBlockByNumber', ['0x1b4', false])

        assert.strictEqual(data.error, undefined)
    })
})

describe('EthProvider.getBlockNumber', () => {
    it('succeeded', async () => {
        let client = new EthProvider({
            endpoint: 'https://bsc-dataseed.binance.org'
        })
        let blockNumber = await client.getBlockNumber()

        assert.strictEqual(typeof blockNumber, 'number')
    })
})

describe('EthProvider.getLogs', () => {
    it('succeeded', async () => {
        let client = new EthProvider({
            endpoint: 'https://bsc-dataseed.binance.org'
        })
        let logs = await client.getLogs({
            fromBlock: '0xCD0A6E', //13437550,
            toBlock: '0xCD0A6E', //13437550
        })

        assert.strictEqual(Array.isArray(logs), true)
        assert.strictEqual(logs.length > 1, true)
    })
})

