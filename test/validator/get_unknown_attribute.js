'use strict'

const assert = require('assert')
const {getUnkownAttribute} = require('../../lib/validator')

describe('validator.getUnkownAttribute', () => {
    it('param "attributes" is not an array, throw error', () => {
        assert.throws(
            () => getUnkownAttribute({}, 1)
        ),
        {
            name: 'TypeError',
            message: 'not an array'
        }
    })

    it('param "attributes" is empty, return undefined', () => {
        let attributes = []
        let expectedResult = undefined
        let actualResult = getUnkownAttribute({}, attributes)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('param "attributes" is empty, return a name', () => {
        let value = {
            foo: 1
        }
        let attributes = []
        let expectedResult = 'foo'
        let actualResult = getUnkownAttribute(value, attributes)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('param "attributes" is not empty, return undefined', () => {
        let value = {
            foo: 1,
            bar: 2
        }
        let attributes = ['foo', 'bar']
        let expectedResult = undefined
        let actualResult = getUnkownAttribute(value, attributes)

        assert.strictEqual(actualResult, expectedResult)
    })

    it('param "attributes" is not empty, return a name', () => {
        let value = {
            foo: 1,
            bar: 2,
            zoo: 3
        }
        let attributes = ['foo', 'bar']
        let expectedResult = 'zoo'
        let actualResult = getUnkownAttribute(value, attributes)

        assert.strictEqual(actualResult, expectedResult)
    })
})
