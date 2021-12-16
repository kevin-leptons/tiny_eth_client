'use strict'

const assert = require('assert')
const {isValidEndpoint} = require('../../lib/validator')

describe('validator.isValidEndpoint', () => {
    it('no url, return false', () => {
        let value = {
            weight: 100
        }
        let expectedResult = false
        let actualResult = isValidEndpoint(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('url has not HTTP protocol, return false', () => {
        let value = {
            url: 'ssh://foo.bar',
            weight: 100
        }
        let expectedResult = false
        let actualResult = isValidEndpoint(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('url contains invalid symbols, return false', () => {
        let value = {
            url: 'http://foo.bar!@#',
            weight: 100
        }
        let expectedResult = false
        let actualResult = isValidEndpoint(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('url has protocol http, return true', () => {
        let value = {
            url: 'http://foo.bar',
            weight: 100
        }
        let expectedResult = true
        let actualResult = isValidEndpoint(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('protocol https, return true', () => {
        let value = {
            url: 'https://foo.bar',
            weight: 100
        }
        let expectedResult = true
        let actualResult = isValidEndpoint(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('has no weight, return false', () => {
        let value = {
            url: 'https://foo.bar'
        }
        let expectedResult = false
        let actualResult = isValidEndpoint(value)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('weight is less than zero, return false', () => {
        let value = {
            url: 'https://foo.bar',
            weight: -1
        }
        let expectedResult = false
        let actualResult = isValidEndpoint(value)

        assert.strictEqual(actualResult, expectedResult)
    })
})
