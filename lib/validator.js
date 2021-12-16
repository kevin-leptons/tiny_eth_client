'use strict'

/*eslint-disable no-unused-vars*/
const {Endpoint, HttpUrl} = require('./type')
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
 * @param {isEthAddressHeximal}
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
 * @param {Abi} value
 * @returns {boolean}
 */
function isAbi(value) {
    if (!Array.isArray(value) || value.length === 0) {
        return false
    }

    return true
}

module.exports = {
    isUnsignedInteger,
    isPositiveInteger,
    isValidEndpoint,
    isValidHttpUrl,
    isEthAddressHeximal,
    isAbi
}
