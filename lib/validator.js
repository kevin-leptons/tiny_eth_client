'use strict'

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

module.exports = {
    isUnsignedInteger
}
