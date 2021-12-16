'use strict'

const assert = require('assert')
const {Gateway} = require('../lib/gateway')
const {Diary} = require('../lib/diary')
const {Node} = require('../lib/node')

describe('Diary.getLogs', () => {
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
        let nodes = endpoints.map((endpoint, index) => {
            return new Node({
                identity: index,
                endpoint: endpoint
            })
        })

        gateway = new Gateway(nodes)
        await gateway.open()
    })

    after(async () => {
        if (gateway) {
            await gateway.close()
        }
    })

    it('succeeded', async () => {
        let diary = new Diary(gateway)
        let logs = await diary.getLogs({
            fromBlock: 13458853,
            toBlock: 13458853,
            address: [
                '0x804678fa97d91b974ec2af3c843270886528a9e6'
            ]
        })

        assert.strictEqual(Array.isArray(logs), true)
    })
})
