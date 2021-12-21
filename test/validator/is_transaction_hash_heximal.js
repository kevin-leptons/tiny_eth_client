/*eslint-disable max-len*/

'use strict'

const assert = require('assert')
const {isTransactionHashHeximal} = require('../../lib/validator')

describe('validator.isTransactionHashHeximal', () => {
    it('return true', () => {
        let value = '0xde5366bf7df801d16e9a883e8801cdbc4ffa0c30a14372e8939bd5cb78b46f5f'
        let expectedResult = true
        let actualResult = isTransactionHashHeximal(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('not a string, return false', () => {
        let value = 1
        let expectedResult = false
        let actualResult = isTransactionHashHeximal(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('more than 32 bytes, return false', () => {
        let value = '0xde5366bf7df801d16e9a883e8801cdbc4ffa0c30a14372e8939bd5cb78b46f5fAAA'
        let expectedResult = false
        let actualResult = isTransactionHashHeximal(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('less than 32 bytes, return false', () => {
        let value = '0xde5366bf7df801d16e9a883e8801cdbc4ffa0c30a14372e8939bd5cb78b4'
        let expectedResult = false
        let actualResult = isTransactionHashHeximal(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('has no prefix "0x", return false', () => {
        let value = 'de5366bf7df801d16e9a883e8801cdbc4ffa0c30a14372e8939bd5cb78b46f5f'
        let expectedResult = false
        let actualResult = isTransactionHashHeximal(value)

        assert.strictEqual(actualResult, expectedResult)
    })
})
