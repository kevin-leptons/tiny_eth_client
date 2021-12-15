'use strict'

const assert = require('assert')
const {Gateway} = require('../lib/gateway')
const {Node} = require('../lib/node')

describe('Gateway.pickNode', () => {
    /**
     * @type {Gateway}
     */
    let gateway

    before(async () => {
        let endpoints = [
            'https://bsc-dataseed.binance.org/',
            'https://bsc-dataseed1.defibit.io/',
            'https://bsc-dataseed1.ninicoin.io/',
            'https://bsc-dataseed2.defibit.io/',
            'https://bsc-dataseed3.defibit.io/',
            'https://bsc-dataseed4.defibit.io/',
            'https://bsc-dataseed2.ninicoin.io/',
            'https://bsc-dataseed3.ninicoin.io/',
            'https://bsc-dataseed4.ninicoin.io/',
            'https://bsc-dataseed1.binance.org/',
            'https://bsc-dataseed2.binance.org/',
            'https://bsc-dataseed3.binance.org/',
            'https://bsc-dataseed4.binance.org/'
        ]
        let nodes = endpoints.map(endpoint => new Node({endpoint}))

        gateway = new Gateway(nodes)
        await gateway.open()
    })

    after(async () => {
        if (gateway) {
            await gateway.close()
        }
    })

    it('should be succeeded', async () => {
        let healthyNode = await gateway.pickNode()

        assert.notStrictEqual(healthyNode, undefined)
    })
})
