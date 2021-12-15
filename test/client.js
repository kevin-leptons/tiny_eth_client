'use strict'

const assert = require('assert')
const {Client} = require('../lib/client')

describe('Client.getBlockNumber', () => {
    /**
     * @type {Client}
     */
    let client

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

        client = new Client({endpoints})
        await client.open()
    })

    after(async () => {
        if (client) {
            await client.close()
        }
    })

    it('should be succeeded', async () => {
        let blockNumber = await client.getBlockNumber()

        assert.strictEqual(typeof blockNumber, 'number')
    })
})

describe('Client.getLogs', () => {
    /**
     * @type {Client}
     */
    let client

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

        client = new Client({endpoints})
        await client.open()
    })

    after(async () => {
        if (client) {
            await client.close()
        }
    })

    it('should be succeeded', async () => {
        let logs = await client.getLogs({
            fromBlock: 13458853,
            toBlock: 13458853,
            address: [
                '0x804678fa97d91b974ec2af3c843270886528a9e6'
            ]
        })

        assert.strictEqual(Array.isArray(logs), true)
    })
})
