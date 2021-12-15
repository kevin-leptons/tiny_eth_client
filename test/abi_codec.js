'use strict'

const assert = require('assert')
const {AbiCodec} = require('../lib')
const UniswapV2PoolAbi = require('./_data/uniswap_v2_pool_abi.json')

describe('AbiCodec', () => {
    it('getEventTopic', () => {
        let iface = new AbiCodec(UniswapV2PoolAbi)
        let actualResult = iface.getEventTopic('Swap')
        let expectedResult = '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822'

        assert.strictEqual(actualResult, expectedResult)
    })
})
