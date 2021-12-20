/*eslint-disable max-len*/

'use strict'

const assert = require('assert')
const {Client} = require('../lib/client')

describe('Client.constructor', () => {
    it('default config, successfully', () => {
        new Client()
    })

    it('invalid "endpoints.url", throw error', () => {
        let config = {
            endpoints: [
                {url: 'ssh://foo.bar', weight: 1}
            ]
        }

        assert.throws(
            () => new Client(config),
            {
                name: 'ClientError',
                message: 'invalid config.endpoints[0]'
            }
        )
    })

    it('invalid "endpoints.weight", throw error', () => {
        let config = {
            endpoints: [
                {url: 'https://foo.bar', weight: -1}
            ]
        }

        assert.throws(
            () => new Client(config),
            {
                name: 'ClientError',
                message: 'invalid config.endpoints[0]'
            }
        )
    })

    it('invalid "reorganisationBlocks", throw error', () => {
        let config = {
            reorganisationBlocks: -1
        }

        assert.throws(
            () => new Client(config),
            {
                name: 'ClientError',
                message: 'invalid config.reorganisationBlocks'
            }
        )
    })

    it('invalid "healthCheckInterval", throw error', () => {
        let config = {
            healthCheckInterval: 0
        }

        assert.throws(
            () => new Client(config),
            {
                name: 'ClientError',
                message: 'invalid config.healthCheckInterval'
            }
        )
    })

    it('invalid attribute name, throw error', () => {
        let config = {
            notExistedAttribute: '?'
        }

        assert.throws(
            () => new Client(config),
            {
                name: 'ClientError',
                message: 'not accepted config.notExistedAttribute'
            }
        )
    })
})

describe('Client', () => {
    /**
     * @type {Client}
     */
    let client

    before(async () => {
        let endpoints = [
            {
                url: 'https://bsc-dataseed.binance.org/',
                weight: 1
            },
            {
                url: 'https://bsc-dataseed1.defibit.io/',
                weight: 1
            },
            {
                url: 'https://bsc-dataseed1.ninicoin.io/',
                weight: 1
            },
            {
                url: 'https://bsc-dataseed2.defibit.io/',
                weight: 1
            }
        ]

        client = new Client({endpoints})
        await client.open()
    })

    after(async () => {
        if (client) {
            await client.close()
        }
    })

    it('blockNumber', () => {
        assert.strictEqual(typeof client.blockNumber, 'number')
    })

    it('getBlockByNumber', async () => {
        let block = await client.getBlockByNumber(13458853)

        assert.deepStrictEqual(block.number, 13458853)
        assert.deepStrictEqual(block.timestamp, 1639457652)
    })

    it('getLogs', async () => {
        let logs = await client.getLogs({
            fromBlock: 13458853,
            toBlock: 13458853,
            address: [
                '0x804678fa97d91b974ec2af3c843270886528a9e6'
            ]
        })

        assert.strictEqual(Array.isArray(logs), true)
    })

    it('getTransaction', async () => {
        let txHash = '0x456d75c7a1a397f7cfea511e932aeeccc36e727db56724df7a424beb14877c5f'
        let actualResult = await client.getTransaction(txHash)
        let expectedResult = {
            blockHash: '0x9b90e97b1dbd7a0534047356adbc298121d44c1c38c7dc1606427bdd0933e1c3',
            blockNumber: 13495100,
            from: '0xe2d3a739effcd3a99387d015e260eefac72ebea1',
            gas: BigInt('0x7fffffffffffffff'),
            gasPrice: BigInt('0x0'),
            hash: '0x456d75c7a1a397f7cfea511e932aeeccc36e727db56724df7a424beb14877c5f',
            input: '0xf340fa01000000000000000000000000e2d3a739effcd3a99387d015e260eefac72ebea1',
            nonce: 415549,
            to: '0x0000000000000000000000000000000000001000',
            transactionIndex: 368,
            value: '0x3546c50e91ed2f1',
            type: 0,
            v: '0x94',
            r: '0x8d5ea39feb9214ab8cefbd6b67a5e6fa712a76173f75d5cafa05aec8c1b3563c',
            s: '0x43c9b5e8d80b3a89a7d3f0a5afdc8b1a0d01fb6d415f62d8fecedf3320763277'
        }

        assert.deepStrictEqual(actualResult, expectedResult)
    })
})

describe('Client._standardizeConfig', () => {
    it('return correct result', () => {
        let config = {
            endpoints: [
                {url: 'http://foo.bar', weight: 1},
                {url: 'https://foo.bar', weight: 1}
            ],
            reorganisationBlocks: 7,
            healthCheckInterval: 4000
        }
        let actualResult = Client._standardizeConfig(config)

        assert.deepStrictEqual(actualResult, config)
    })

    it('return default "endpoints"', () => {
        let config = {
            reorganisationBlocks: 7,
            healthCheckInterval: 4000
        }
        let expectedResult = {
            endpoints: [
                {
                    url: 'http://localhost:8545',
                    weight: 1
                }
            ],
            reorganisationBlocks: 7,
            healthCheckInterval: 4000
        }
        let actualResult = Client._standardizeConfig(config)

        assert.deepStrictEqual(actualResult, expectedResult)
    })

    it('return default "reorganisationBlocks"', () => {
        let config = {
            endpoints: [
                {
                    url: 'http://localhost:8545',
                    weight: 1
                }
            ],
            healthCheckInterval: 4000
        }
        let expectedResult = {
            endpoints: [
                {
                    url: 'http://localhost:8545',
                    weight: 1
                }
            ],
            reorganisationBlocks: 6,
            healthCheckInterval: 4000
        }
        let actualResult = Client._standardizeConfig(config)

        assert.deepStrictEqual(actualResult, expectedResult)
    })

    it('return default "healthCheckInterval"', () => {
        let config = {
            endpoints: [
                {
                    url: 'http://localhost:8545',
                    weight: 1
                }
            ],
            reorganisationBlocks: 7
        }
        let expectedResult = {
            endpoints: [
                {
                    url: 'http://localhost:8545',
                    weight: 1
                }
            ],
            reorganisationBlocks: 7,
            healthCheckInterval: 3000
        }
        let actualResult = Client._standardizeConfig(config)

        assert.deepStrictEqual(actualResult, expectedResult)
    })
})
