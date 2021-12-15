'use strict'

const assert = require('assert')
const {Node, NodeStatus} = require('../lib/node')

describe('Node.call', () => {
    it('should be succeeded', async () => {
        let node = new Node({
            endpoint: 'https://bsc-dataseed.binance.org'
        })
        let method = 'eth_getBlockByNumber'
        let params = ['0x1b4', false]
        let actualResult = await node.call(method, params)

        assert.strictEqual(actualResult.error, undefined)
        assert.strictEqual(actualResult.number, '0x1b4')
    })
})

describe('Node.getStat', () => {
    it('should be succeeded', async () => {
        let node = new Node({
            endpoint: 'https://bsc-dataseed.binance.org'
        })
        let actualResult = await node.getStat()

        assert.strictEqual(actualResult.status, NodeStatus.OK)
        assert.strictEqual(typeof actualResult.latestBlockNumer, 'number')
        assert.strictEqual(actualResult.message, undefined)
    })
})
