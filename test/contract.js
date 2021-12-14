'use strict'

const assert = require('assert')
const {Contract} = require('../lib/contract')
const {Client} = require('../lib/client')
const UniswapV2PoolAbi = require('./_data/uniswap_v2_pool_abi.json')
const UniswapV2FactoryAbi = require('./_data/uniswap_v2_factory.json')

describe('Contract.call', () => {
    let client

    before(async () => {
        client = new Client({
            endpoints: [
                'https://bsc-dataseed.binance.org'
            ]
        })
        await client.open()
    })

    after(async () => {
        if (client) {
            await client.close()
        }
    })

    it('call decimals() from a Uniswap V2 pool', async () => {

        let address = '0x804678fa97d91b974ec2af3c843270886528a9e6'
        let contract = new Contract(address, UniswapV2PoolAbi, client)
        let expectedResult = [18]
        let actualResult = await contract.call('decimals')

        assert.deepStrictEqual(actualResult, expectedResult)
    })

    it('call getPair() from Pancakeswap factory', async () => {
        let address = '0xbcfccbde45ce874adcb698cc183debcf17952812'
        let contract = new Contract(address, UniswapV2FactoryAbi, client)
        let actualResult = await contract.call('getPair', [
            '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
            '0xe9e7cea3dedca5984780bafc599bd69add087d56'
        ])
        let expectedResult = [
            '0x1B96B92314C44b159149f7E0303511fB2Fc4774f'
        ]

        assert.deepStrictEqual(actualResult, expectedResult)
    })
})
