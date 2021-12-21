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
 * @typedef {number} PositiveInteger
 *
 * Positive integer number.
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
 * @typedef {string} TransactionHashHeximal
 *
 * 32 bytes as heximal string.
 */

/**
 * @typedef {string} HttpUrl
 *
 * A URL that has protocol `http` or `https`.
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
 * @property {TransactionHashHeximal} transactionHash
 */

/**
 * @typedef {object} Transaction
 * @property {TransactionHashHeximal} hash
 * @property {EthAddressHeximal} from
 * @property {EthAddressHeximal} to
 * @property {number} blockNumber
 * @property {number} transactionIndex
 * @property {number} type
 * @property {number} nonce
 * @property {BigInt} gas
 * @property {BigInt} gasPrice
 * @property {Heximal} input
 * @property {Heximal} value
 * @property {Heximal} r
 * @property {Heximal} s
 * @property {Heximal} v
 */

/**
 * @typedef {object} Block
 * @property {Heximal} parentHash
 * @property {Heximal} receiptsRoot
 * @property {Heximal} totalDifficulty
 * @property {Heximal} transactionsRoot
 * @property {Heximal} gasLimit
 * @property {Heximal} nonce
 * @property {UnsignedInteger} number
 * @property {Heximal} gasUsed
 * @property {Heximal} mixHash
 * @property {Heximal} sha3Uncles
 * @property {UnsignedInteger} timestamp
 * @property {Array} uncles
 * @property {Heximal} difficulty
 * @property {Heximal} hash
 * @property {Heximal} logsBloom
 * @property {Heximal} stateRoot
 * @property {Array<TransactionHashHeximal>} transactions
 * @property {Heximal} extraData
 * @property {EthAddressHeximal} miner
 * @property {Heximal} size
 */

/**
 * @typedef {object} EthProviderConfig
 * @property {string} endpoint - URL refer to ETH RPC endpoint.
 */

/**
 * @typedef {object} GateWayConfig
 * @property {UnsignedInteger} [healthcheckInterval=3000] - For each time
 * period, check health of nodes, in miliseconds.
 * @property {UnsignedInteger} [reorganisationBlocks=6] - Safe block number
 * `s = latest - reorganisationBlocks`.
 */

/**
 * @typedef {string} HttpUrl
 */

/**
 * @typedef {object} Endpoint
 * @property {HttpUrl} url - A HTTP URL such as `http://` or `https://`.
 * @property {UnsignedInteger} weight - The greater value, the more requests
 * will be send to this node. If it is zero then the node will not receive
 * any requests.
 */

/**
 * @typedef {Array} Abi
 *
 * ABI of a contract on ETH network.
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
