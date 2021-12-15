'use strict'

const {isUnsignedInteger} = require('./validator')
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
    }

    /**
     *
     * @param {LogFilter} filter
     * @returns {Promise<Array<Log>>}
     */
    async getLogs(filter) {
        let nowFilter = Diary._standardizeFilter(filter)
        let node = this._pickNode()
        let logs = []

        for (;;) {
            let logBlock = await this._getLogsFromNode(node, nowFilter)

            if (logBlock.length === 0) {
                break
            }

            logs = [...logs, ...logBlock]

            if (logs[logs.length - 1].blockNumber === nowFilter.toBlock) {
                break
            }

            nowFilter.fromBlock = logs[logs.length - 1].blockNumber + 1
        }

        return logs
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
        let result = Object.assign({}, filter)

        result.fromBlock = numberToHeximal(filter.fromBlock)
        result.toBlock = numberToHeximal(filter.toBlock)

        return result
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
            maxRetry: 10
        }

        return Object.assign(defaultConfig, config)
    }

    /**
     * @private
     * @param {object} filter
     * @returns {LogFilter}
     */
    static _standardizeFilter(filter) {
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

        return Object.assign({}, filter)
    }
}

module.exports = {
    Diary,
    DiaryError
}
