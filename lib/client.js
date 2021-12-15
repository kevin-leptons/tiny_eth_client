'use strict'

const {Node} = require('./node')
const {Gateway} = require('./gateway')
const {Diary} = require('./diary')

/**
 * @typedef {object} ClientConfig
 * @property {Array<string>} [endpoints] - List of BSC endpoints.
 * @property {UnsignedInteger} [reorganisationBlocks] - There is a block "n =
 * latest - reorganisationBlocks", "latest" is newest mined block number. The
 * client will not process related things that has block number greater than
 * n. Default is 6.
 * @property {UnsignedInteger} [updateProviderInterval] - For each time period,
 * check health of nodes, in miliseconds. Default is 3000.
 */

class ClientError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ClientError'
    }
}

class Client {
    /**
     * @param {ClientConfig} config
     */
    constructor(config) {
        let validConfig = Client._standardizeConfig(config)
        let nodes = validConfig.endpoints.map(endpoint => {
            return new Node({endpoint})
        })

        this._gateway = new Gateway(nodes, {
            healthcheckInterval: validConfig.updateProviderInterval
        })
        this._reorganisationblocks = validConfig.reorganisationBlocks
    }

    async open() {
        await this._gateway.open()
        this._diary = new Diary(this._gateway)
    }

    async close() {
        if (this._gateway) {
            await this._gateway.close()
            this._gateway = undefined
        }
    }

    /**
     * @returns {Promise<number>} Latest mined block number.
     */
    async getBlockNumber() {
        let node = this._pickNode()

        return await node.getBlockNumber()
    }

    /**
     *
     * @param {LogFilter} filter
     */
    async getLogs(filter) {
        return await this._diary.getLogs(filter)
    }

    /**
     *
     * @param {string} method
     * @param {array} data
     * @returns {Promise<Array | object>}
     */
    async call(method, data) {
        let node = this._pickNode()

        return await node.call(method, data)
    }

    /**
     * @private
     * @returns {Node}
     */
    _pickNode() {
        let node = this._gateway.pickNode()

        if (!node) {
            throw new ClientError('no avaiable node')
        }

        return node
    }

    /**
     * @private
     * @param {ClientConfig} config
     * @returns {InternalClientConfig}
     */
    static _standardizeConfig(config) {
        let defaultConfig = {
            endpoints: ['http://localhost:8456'],
            reorganisationBlocks: 6,
            updateProviderInterval: 3000
        }

        return Object.assign(defaultConfig, config)
    }
}

module.exports = {
    Client,
    ClientError
}
