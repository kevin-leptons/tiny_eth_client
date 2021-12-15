'use strict'

const axios = require('axios')
const {RpcError} = require('./type')

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
     * Retrieve stat of this node.
     *
     * @returns {Promise<NodeStat>}
     */
    async getStat() {
        try {
            return {
                status: NodeStatus.OK,
                latestBlockNumer: await this._getBlockNumber()
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
}

module.exports = {
    Node,
    NodeStatus
}
