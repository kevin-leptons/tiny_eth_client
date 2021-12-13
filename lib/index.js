'use strict'

const axios = require('axios')

/**
 * @typedef {object} ClientConfig
 * @property {Array<string>} endpoints - List of BSC endpoints.
 * @property {UnsignedInteger} reorganisationBlocks - There is a block "n =
 * latest - reorganisationBlocks", "latest" is newest mined block number. The
 * client will not process related things that has block number greater than
 * n.
 *
 * @typedef {string} EthAddressHeximal
 *
 * ETH address, 20 bytes as heximal with prefix "0x".
 *
 * @typedef {number} UnsignedInteger
 *
 * Unsigned integer number.
 *
 * @typedef {object} LogFilter
 * @property {Array<EthAddressHeximal>} addresses
 * @property {UnsignedInteger} fromBlock
 * @property {UnsignedInteger} toBlock
 * @property {Array<Topic>} topics
 *
 * @typedef {object} EthProviderConfig
 * @property {string} endpoint - URL refer to ETH RPC endpoint.
 */

class Client {
    /**
     * @param {ClientConfig} config
     */
    constructor(config) {
        this._providers = config.endpoints.map(endpoint => {
            return new EthProvider(endpoint)
        })
        this._reorganisationblocks = config.reorganisationBlocks
        this._startMonitorProviders()
    }

    /**
     * @returns {number} Latest mined block number.
     */
    async getBlockNumber() {}

    /**
     *
     * @param {LogFilter} filter
     */
    async getLogs(filter) {}

    _startMonitorProviders() {}
}

class EthProvider {
    /**
     *
     * @param {EthProviderConfig} config
     */
    constructor(config) {
        this._httpClient = axios.create({
            baseURL: config.endpoint
        })
    }

    async getBlockNumber() {
        let result = await this._call('eth_blockNumber', [])

        return Number.parseInt(result)
    }

    /**
     *
     * @param {LogFilter} filter
     * @returns {Array<Log>} - List of matched logs.
     */
    async getLogs(filter) {
        let result = await this._call('eth_getLogs', [
            filter
        ])

        return result
    }

    /**
     *
     * @param {string} method
     * @param {Array | object} data
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
            throw new Error(error)
        }

        return result
    }
}

class Contract {
    constructor(client) {}

    async call(method, params) {}
}

module.exports = {
    Client,
    _private: {
        EthProvider
    }
}
