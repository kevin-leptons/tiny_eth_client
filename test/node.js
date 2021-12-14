'use strict'

const assert = require('assert')
const {Node, NodeStatus} = require('../lib/node')

describe('Node._call', () => {
    it('succeeded', async () => {
        let client = new Node({
            endpoint: 'https://bsc-dataseed.binance.org'
        })
        let data = await client._call('eth_getBlockByNumber', ['0x1b4', false])

        assert.strictEqual(data.error, undefined)
    })
})

describe('Node.getBlockNumber', () => {
    it('succeeded', async () => {
        let client = new Node({
            endpoint: 'https://bsc-dataseed.binance.org'
        })
        let blockNumber = await client.getBlockNumber()

        assert.strictEqual(typeof blockNumber, 'number')
    })
})

describe('Node.getLogs', () => {
    it('succeeded', async () => {
        let client = new Node({
            endpoint: 'https://bsc-dataseed.binance.org'
        })
        let logs = await client.getLogs({
            fromBlock: 13437550,
            toBlock: 13437550
        })

        assert.strictEqual(Array.isArray(logs), true)
        assert.strictEqual(logs.length > 1, true)
    })
})

describe('Node.getStat', () => {
    it('succeeded', async () => {
        let client = new Node({
            endpoint: 'https://bsc-dataseed.binance.org'
        })
        let actualResult = await client.getStat()

        assert.strictEqual(actualResult.status, NodeStatus.OK)
        assert.strictEqual(typeof actualResult.latestBlockNumer, 'number')
        assert.strictEqual(actualResult.message, undefined)
    })
})
