'use strict'

const {isUnsignedInteger} = require('./validator')
const {numberToHeximal} = require('./formatter')

/**
 * @typedef {import('./gateway').Gateway} Gateway
 * @typedef {import('./node').Node} Node
 * @typedef {import('./type').UnsignedInteger} UnsignedInteger
 * @typedef {import('./type').LogFilter} LogFilter
 * @typedef {import('./type').Log} Log
 */

/**
 * @typedef {object} DiaryConfig
 * @property {UnsignedInteger} maxRetry - Default is 10.
 */

class DiaryError extends Error {
    constructor(message) {
        super(message)
        this.name = 'DiaryError'
    }
}

class Diary {
    constructor(gateway, config) {
        let validConfig = Diary._standardConig(config)

        this._gateway = gateway
        this._maxRetry = validConfig.maxRetry
    }

    /**
     *
     * @param {LogFilter} filter
     * @returns {Promise<Array<Log>>}
     */
    async getLogs(filter) {
        let nowFilter = Diary._standardizeConfig(filter)
        let node = this._pickNode()
        let logs = []

        for (;;) {
            let logBlock = await node.getLogs(nowFilter)

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
     *
     * @param {object} config
     * @returns {DiaryConfig}
     */
    static _standardConig(config) {
        let defaultConfig = {
            maxRetry: 10
        }

        return Object.assign(defaultConfig, config)
    }

    /**
     *
     * @param {object} filter
     * @returns {LogFilter}
     */
    static _standardizeConfig(filter) {
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
