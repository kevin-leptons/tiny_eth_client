'use strict'

const {
    isUnsignedInteger,
    isEthAddressHeximal,
    getUnkownAttribute
} = require('./validator')
const {numberToHeximal, heximalToNumber} = require('./formatter')

/*eslint-disable no-unused-vars*/
const {Gateway} = require('./gateway')
const {Node} = require('./node')
const {
    UnsignedInteger,
    LogFilter,
    Log,
    Heximal,
    EthAddressHeximal
} = require('./type')
/*eslint-enable no-unused-vars*/

/**
 * @typedef {object} DiaryConfig
 * @property {UnsignedInteger} [maxRetry=10] - Number of times for retring
 * getting log before give up.
 * @property {UnsignedInteger} [reorganisationBlocks=6] - There is a block
 * `n = latest - reorganisationBlocks`, the diary does not process things
 * that has block number greater than `n`. Where `latest` is latest mined
 * block number.
 */

/**
 * @typedef {object} RpcLogFilter
 * @property {Heximal} fromBlock - Searching where block number
 * is greater than or equal this one.
 * @property {Heximal} toBlock - Searching where block number
 * is less than or equal this one.
 * @property {Array<EthAddressHeximal>} [addresses=[]] - List of addresses
 * that emits log records.
 * @property {Array<Topic>} [topics=[]] - Searching for matched topics.
 */

class DiaryError extends Error {
    constructor(message) {
        super(message)
        this.name = 'DiaryError'
    }
}

/**
 * @private
 */
class Diary {
    /**
     *
     * @param {Gateway} gateway
     * @param {DiaryConfig} config
     */
    constructor(gateway, config) {
        let validConfig = Diary._standardizeConfig(config)

        this._gateway = gateway
        this._maxRetry = validConfig.maxRetry
        this._reorganisationBlocks = validConfig.reorganisationBlocks
    }

    /**
     *
     * @param {LogFilter} filter
     * @returns {Promise<Array<Log>>}
     */
    async getLogs(filter) {
        let validFilter = Diary._standardizeFilter(filter)

        if (this._gateway.safeBlockNumber === undefined) {
            throw new DiaryError('no safe block for calling')
        }

        if (validFilter.toBlock > this._gateway.safeBlockNumber) {
            throw new DiaryError('unsafe block calling')
        }

        let node = this._pickNode()

        return await this._getLogsFromNode(node, validFilter)
    }

    /**
     * @private
     * @returns {Node}
     */
    _pickNode() {
        let node = this._gateway.pickNode()

        if (!node) {
            throw new DiaryError('no avaiable node')
        }

        return node
    }

    /**
     * @private
     * @param {Node} node
     * @param {LogFilter} filter
     * @returns {Promise<Array<Log>>}
     */
    async _getLogsFromNode(node, filter) {
        let rpcFilter = Diary._toRpcLogfilter(filter)
        let logs = await node.call('eth_getLogs', [rpcFilter])

        logs.forEach(Diary._formatLogInplace)

        return logs
    }

    /**
     * @private
     * @param {any} filter
     * @returns {RpcLogFilter}
     */
    static _toRpcLogfilter(filter) {
        return {
            address: filter.addresses,
            fromBlock: numberToHeximal(filter.fromBlock),
            toBlock: numberToHeximal(filter.toBlock),
            topics: filter.topics
        }
    }

    /**
     * @private
     * @param {any} log
     * @returns {Log}
     */
    static _formatLogInplace(log) {
        log.blockNumber = heximalToNumber(log.blockNumber)
        log.logIndex = heximalToNumber(log.logIndex)
        log.transactionIndex = heximalToNumber(log.transactionIndex)
    }

    /**
     * @private
     * @param {object} config
     * @returns {DiaryConfig}
     */
    static _standardizeConfig(config) {
        let defaultConfig = {
            maxRetry: 10,
            reorganisationBlocks: 6
        }

        return Object.assign(defaultConfig, config)
    }

    /**
     * @private
     * @param {object} filter
     * @returns {LogFilter}
     */
    static _standardizeFilter(filter) {
        let invalidAttribute = getUnkownAttribute(filter, [
            'fromBlock',
            'toBlock',
            'addresses',
            'topics'
        ])

        if (invalidAttribute !== undefined) {
            throw new TypeError('unkown attribute: ' + invalidAttribute)
        }

        if (!isUnsignedInteger(filter.fromBlock)) {
            throw new DiaryError('invalid filter.fromBlock')
        }

        if (!isUnsignedInteger(filter.toBlock)) {
            throw new DiaryError('invalid filter.toBlock')
        }

        if (filter.fromBlock > filter.toBlock) {
            throw new DiaryError(
                'filter.fromBlock is greater than filter.toBlock'
            )
        }

        if (filter.addresses !== undefined) {
            if (!Array.isArray(filter.addresses)) {
                throw new DiaryError(
                    'invalid filter.addresses'
                )
            }

            for (let i = 0; i < filter.addresses.length; ++i) {
                if (!isEthAddressHeximal(filter.addresses[i])) {
                    throw new DiaryError(
                        `invalid filter.addresses[${i}]`
                    )
                }
            }
        }

        return Object.assign({}, filter)
    }
}

module.exports = {
    Diary,
    DiaryError
}
