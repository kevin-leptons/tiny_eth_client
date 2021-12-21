'use strict'

/*eslint-disable no-unused-vars*/
const {
    Endpoint,
    HttpUrl,
    TransactionHashHeximal,
    EthAddressHeximal
} = require('./type')
/*eslint-enable no-unused-vars*/

/**
 *
 * @param {any} value
 * @returns {boolean}
 */
function isUnsignedInteger(value) {
    if (!Number.isInteger(value) || value < 0) {
        return false
    }

    return true
}

/**
 *
 * @param {any} value
 * @returns {boolean}
 */
function isPositiveInteger(value) {
    if (!Number.isInteger(value) || value <= 0) {
        return false
    }

    return true
}

/**
 *
 * @param {HttpUrl} value
 * @returns {boolean}
 */
function isValidHttpUrl(value) {
    try {
        let url = new URL(value)

        return (url.protocol === 'http:') || (url.protocol === 'https:')
    }
    catch {
        return false
    }
}

/**
 *
 * @param {Endpoint} value
 * @returns {boolean}
 */
function isValidEndpoint(value) {
    if (!isValidHttpUrl(value.url)) {
        return false
    }

    if (!isUnsignedInteger(value.weight)) {
        return false
    }

    return true
}

/**
 * @param {EthAddressHeximal}
 * @returns {boolean}
 */
function isEthAddressHeximal(value) {
    if (typeof value !== 'string') {
        return false
    }

    return /^0x[a-fA-F0-9]{40}$/.test(value)
}

/**
 *
 * @param {TransactionHashHeximal} value
 * @returns {boolean}
 */
function isTransactionHashHeximal(value) {
    if (typeof value !== 'string') {
        return false
    }

    return /^0x[a-fA-F0-9]{64}$/.test(value)
}

/**
 *
 * @param {Abi} value
 * @returns {boolean}
 */
function isAbi(value) {
    if (!Array.isArray(value) || value.length === 0) {
        return false
    }

    return true
}

/**
 *
 * @param {any} value
 * @param {Array<string>} attributes
 * @returns {string | undefined}
 */
function getUnkownAttribute(value, attributes) {
    if (!Array.isArray(attributes)) {
        throw new TypeError('not an array')
    }

    let keys = Object.keys(value)

    for (let key of keys) {
        if (typeof key !== 'string') {
            throw new TypeError('not a string')
        }

        if (!attributes.includes(key)) {
            return key
        }
    }

    return undefined
}

module.exports = {
    isUnsignedInteger,
    isPositiveInteger,
    isValidEndpoint,
    isValidHttpUrl,
    isEthAddressHeximal,
    isTransactionHashHeximal,
    isAbi,
    getUnkownAttribute
}
