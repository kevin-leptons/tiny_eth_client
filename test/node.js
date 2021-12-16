'use strict'

const assert = require('assert')
const {Node, NodeStatus} = require('../lib/node')

describe('Node.call', () => {
    it('should be succeeded', async () => {
        let node = new Node({
            identity: 1,
            endpoint: 'https://bsc-dataseed.binance.org'
        })
        let method = 'eth_getBlockByNumber'
        let params = ['0x1b4', false]
        let actualResult = await node.call(method, params)

        assert.strictEqual(actualResult.error, undefined)
        assert.strictEqual(actualResult.number, '0x1b4')
    })
})

describe('Node.updateStat', () => {
    it('should be succeeded', async () => {
        let node = new Node({
            identity: 1,
            endpoint: 'https://bsc-dataseed.binance.org'
        })

        await node.updateStat()
        assert.strictEqual(node.status, NodeStatus.OK)
        assert.strictEqual(typeof node.latestBlockNumer, 'number')
        assert.strictEqual(node.error, undefined)
    })
})
