'use strict'

const axios = require('axios')
const {RpcError} = require('./type')
const {isUnsignedInteger} = require('./validator')

/*eslint-disable no-unused-vars*/
const {UnsignedInteger} = require('./type')
/*eslint-enable no-unused-vars*/

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
 * @property {UnsignedInteger | undefined} blockNumber
 * @property {string | undefined} message
 */

/**
 * @typedef {object} NodeConfig
 * @property {UnsignedInteger} identity
 * @property {HttpUrl} [endpoint='http://localhost:8545']
 * @property {UnsignedInteger} [weight=1] - It is use for evalution and
 * distribution requests between nodes. The greater weight, the more
 * requests is dispatch to this node.
 */

class NodeError extends Error {
    constructor(message) {
        super(message)
        this.name = 'NodeError'
    }
}

/**
 * @private
 */
class Node {
    /**
     *
     * @param {NodeConfig} config
     */
    constructor(config) {
        let validConfig = Node._standardizeConfig(config)

        this._identity = validConfig.identity
        this._weight = validConfig.weight
        this._httpClient = axios.create({
            baseURL: validConfig.endpoint
        })
    }

    /**
     * @returns {UnsignedInteger}
     */
    get identity() {
        return this._identity
    }

    /**
     * @returns {NodeStatus | undefined}
     */
    get status() {
        return this._status
    }

    /**
     * @returns {UnsignedInteger | undefined}
     */
    get blockNumber() {
        return this._blockNumber
    }

    /**
     * @returns {any}
     */
    get error() {
        return this._error
    }

    /**
     * @returns {number}
     */
    get weight() {
        return this._weight
    }

    /**
     * Update state of this node itself. This method should be call
     * before read attributes.
     *
     * @returns {Promise<undefined>}
     */
    async updateStat() {
        try {
            this._blockNumber = await this._getBlockNumber()
            this._status = NodeStatus.OK
            this._error = undefined
        }
        catch (error) {
            this._status = NodeStatus.ERROR
            this._error = error
        }
    }

    /**
     * Perform a calling to ETH node.
     *
     * @param {string} method - Method to be call, see
     * [ETH JSON RPC](https://eth.wiki/json-rpc/API).
     * @param {Array<any>} params - Positional arguments to pass to method.
     * @returns {Promise<any>}
     */
    async call(method, params) {
        return await this._call(method, params)
    }

    /**
     * Retrieve number of latest block which is mined.
     *
     * @private
     * @returns {Promise<number>}
     */
    async _getBlockNumber() {
        let result = await this._call('eth_blockNumber', [])

        return Number.parseInt(result)
    }

    /**
     * @private
     * @param {string} method - Mehod to be call.
     * @param {Array<any>} params - Positional parameters.
     * @returns {Promise<any>}
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
     *
     * @param {any} config
     * @returns {NodeConfig}
     */
    static _standardizeConfig(config) {
        if (!isUnsignedInteger(config.identity)) {
            throw new NodeError('invalid identity')
        }

        let defaultConfig = {
            endpoint: 'http://localhost:8545',
            weight: 1
        }

        return Object.assign(defaultConfig, config)
    }
}

module.exports = {
    Node,
    NodeStatus,
    NodeError
}
