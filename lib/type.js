'use strict'

/**
 * @typedef {string} EthAddressHeximal
 *
 * ETH address, 20 bytes as heximal with prefix "0x".
 */

/**
 * @typedef {number} UnsignedInteger
 *
 * Unsigned integer number.
 */

/**
 * @typedef {string} Heximal
 *
 * Hex string with prefix "0x".
 */

/**
 * @typedef {string} BlockHashHeximal
 *
 * 32 bytes block hash as heximal with prefix "0x".
 */

/**
 * @typedef {string} TransactionHash
 *
 * 32 bytes transaction hash as heximal with prefix "0x".
 */

/**
 * @typedef {object} LogFilter
 * @property {UnsignedInteger} fromBlock - Searching where block number
 * is greater than or equal this one.
 * @property {UnsignedInteger} toBlock - Searching where block number
 * is less than or equal this one.
 * @property {Array<EthAddressHeximal>} [addresses=[]] - List of addresses
 * that emits log records.
 * @property {Array<Topic>} [topics=[]] - Searching for matched topics.
 */

/**
 * @typedef {object} Log
 * @property {EthAddressHeximal} address
 * @property {UnsignedInteger} blockNumber
 * @property {UnsignedInteger} logIndex
 * @property {UnsignedInteger} transactionIndex
 * @property {boolean} removed
 * @property {Array<Topic>} topics
 * @property {Heximal} data
 * @property {BlockHashHeximal} blockHash
 * @property {TransactionHashHeximal} TransactionHash
 */

/**
 * @typedef {object} EthProviderConfig
 * @property {string} endpoint - URL refer to ETH RPC endpoint.
 */

/**
 * @typedef {object} GateWayConfig
 * @property {UnsignedInteger} [healthcheckInterval=3000] - For each time
 * period, check health of nodes, in miliseconds.
 */

class RpcError extends Error {
    constructor(error) {
        super(error.message)
        this.name = 'RpcError'
        this.code = error.code
    }
}

module.exports = {
    RpcError
}
