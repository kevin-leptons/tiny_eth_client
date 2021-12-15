'use strict'

/*eslint-disable no-unused-vars*/
const {Heximal} = require('./type')
/*eslint-enable no-unused-vars*/

/**
 *
 * @param {any} number
 * @param {Heximal} defaultValue
 * @returns {Heximal | undefined}
 */
function numberToHeximal(number, defaultValue=undefined) {
    if (number === undefined) {
        return defaultValue
    }

    if (!Number.isInteger(number) || number < 0) {
        return undefined
    }

    return '0x' + number.toString(16)
}

/**
 *
 * @param {any} heximal
 * @param {number} defaultValue
 * @returns {number}
 */
function heximalToNumber(heximal, defaultValue=undefined) {
    if (heximal === undefined) {
        return defaultValue
    }

    return Number(heximal)
}

module.exports = {
    numberToHeximal,
    heximalToNumber
}
