'use strict'

const assert = require('assert')
const {isValidHttpUrl} = require('../../lib/validator')

describe('validator.isValidHttpUrl', () => {
    it('no protocol, return false', () => {
        let value = 'foo.bar'
        let expectedResult = false
        let actualResult = isValidHttpUrl(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('not HTTP protocol, return false', () => {
        let value = 'ssh://foo.bar'
        let expectedResult = false
        let actualResult = isValidHttpUrl(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('contains invalid symbols, return false', () => {
        let value = 'http://foo.bar!@#'
        let expectedResult = false
        let actualResult = isValidHttpUrl(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('protocol http, return true', () => {
        let value = 'http://foo.bar'
        let expectedResult = true
        let actualResult = isValidHttpUrl(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('protocol https, return true', () => {
        let value = 'https://foo.bar'
        let expectedResult = true
        let actualResult = isValidHttpUrl(value)

        assert.strictEqual(actualResult, expectedResult)
    })
})
