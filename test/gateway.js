'use strict'

const assert = require('assert')
const {Gateway} = require('../lib/gateway')
const {Node} = require('../lib/node')

describe('Gateway.pickNode', () => {
    /**
     * @type {Gateway}
     */
    let gateway
    let totalWeight

    before(async () => {
        let endpoints = [
            'https://bsc-dataseed.binance.org/',
            'https://bsc-dataseed1.defibit.io/',
            'https://bsc-dataseed1.ninicoin.io/',
            'https://bsc-dataseed2.defibit.io/',
            'https://bsc-dataseed3.defibit.io/'
        ]
        let nodes = endpoints.map((endpoint, index) => {
            return new Node({
                identity: index + 1,
                endpoint: endpoint,
                weight: index
            })
        })

        totalWeight = nodes.reduce((total, node) => {
            return total + node.weight
        }, 0)
        gateway = new Gateway(nodes)
        await gateway.open()
    })

    after(async () => {
        if (gateway) {
            await gateway.close()
        }
    })

    it('should be succeeded', async () => {
        let expectedResult = [
            5, 4, 5, 3, 4,
            5, 2, 3, 4, 5
        ]
        let actualResult = []

        for (let i = 1; i <= totalWeight; ++i) {
            let node = await gateway.pickNode()

            actualResult.push(node.identity)
        }

        // assert.deepStrictEqual(actualResult, expectedResult)
    })
})
