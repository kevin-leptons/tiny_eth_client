'use strict'

const axios = require('axios')
const {RpcError} = require('./type')
const {heximalToNumber, numberToHeximal} = require('./formatter')

const {UnsignedInteger} = require('./type')

/**
 * @enum {number}
 */
const NodeStatus = {
    OK: 0,
    DISCONNECTED: 1,
    ERROR: 2
}

/**
 * @typedef {object} NodeStat
 * @property {NodeStatus} status
 * @property {UnsignedInteger | undefined} latestBlockNumer
 * @property {string | undefined} message
 */

/**
 * @private
 */
class Node {
    /**
     *
     * @param {NodeConfig} config
     */
    constructor(config) {
        this._httpClient = axios.create({
            baseURL: config.endpoint
        })
    }

    /**
     * @returns {Promise<NodeStat>}
     */
    async getStat() {
        try {
            return {
                status: NodeStatus.OK,
                latestBlockNumer: await this.getBlockNumber()
            }
        }
        catch (error) {
            return {
                status: NodeStatus.ERROR,
                message: error.message
            }
        }
    }

    /**
     *
     * @returns {Promise<number>}
     */
    async getBlockNumber() {
        let result = await this._call('eth_blockNumber', [])

        return Number.parseInt(result)
    }

    /**
     *
     * @param {LogFilter} filter
     * @returns {Promise<Array<Log>>} - List of matched logs.
     */
    async getLogs(filter) {
        let validFilter = Node._standardFilter(filter)
        let logs = await this._call('eth_getLogs', [
            validFilter
        ])

        return logs.map(Node._formatLog)
    }

    /**
     *
     * @param {Promise<Array | object>} params
     */
    async call(params) {
        return await this._call('eth_call', params)
    }

    /**
     * @private
     * @param {string} method
     * @param {Promise<Array | object>} data
     */
    async _call(method, params) {
        let response = await this._httpClient.post('/', {
            id: 1,
            jsonrpc: '2.0',
            method: method,
            params: params
        })
        let {error, result} = response.data

        if (error) {
            throw new RpcError(error)
        }

        return result
    }

    /**
     * @private
     * @param {object} log
     * @returns {Log}
     */
    static _formatLog(log) {
        let result = Object.assign({}, log)

        result.blockNumber = heximalToNumber(log.blockNumber)
        result.logIndex = heximalToNumber(log.logIndex)
        result.transactionIndex = heximalToNumber(log.transactionIndex)

        return result
    }

    /**
     * @private
     * @param {any} filter
     * @returns {LogFilter}
     */
    static _standardFilter(filter) {
        let validFilter = Object.assign({}, filter)

        validFilter.fromBlock = numberToHeximal(filter.fromBlock)
        validFilter.toBlock = numberToHeximal(filter.toBlock)

        return validFilter
    }
}

module.exports = {
    Node,
    NodeStatus
}
