'use strict'

const {Node} = require('./node')
const {Gateway} = require('./gateway')
const {Diary} = require('./diary')
const {heximalToNumber} = require('./formatter')

/*eslint-disable no-unused-vars*/
const {
    LogFilter,
    Transaction,
    TransactionHashHeximal
} = require('./type')
/*eslint-enable no-unused-vars*/

/**
 * @typedef {object} ClientConfig
 * @property {Array<string>} [endpoints=['http://localhost:8545']] - List of
 * BSC endpoints.
 * @property {UnsignedInteger} [reorganisationBlocks=6] - There is a block
 * `n = latest - reorganisationBlocks`. Where `latest` is newest mined block
 * number. The client will not process related things that has block number
 * greater than block number `n`.
 * @property {UnsignedInteger} [updateProviderInterval=3000] - For each time
 * period, check health of nodes, in miliseconds. Default is 3000.
 */

class ClientError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ClientError'
    }
}

/**
 * * Interact with ETH node as accurate, durable and stable as possible.
 * * Work with more than an ETH node, do load balancing and healthcheck.
 * * WARN: It does not work with domain name that does load balancing to
 *   other nodes.
 */
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
     * Retrieve number of block which is latest mined.
     * It is equivalent to RPC `eth_blockNumber`.
     *
     * @returns {Promise<number>}
     */
    async getBlockNumber() {
        let node = this._pickNode()
        let result = await node.call('eth_blockNumber')

        return Number.parseInt(result)
    }

    /**
     * Retrieve log records.
     * It is equivalent to RPC `eth_getLogs`.
     *
     * @param {LogFilter} filter - Matching conditions.
     * @returns {Promise<Array<Log>>}
     */
    async getLogs(filter) {
        return await this._diary.getLogs(filter)
    }

    /**
     *
     * @param {TransactionHashHeximal} txHash
     * @returns {Transaction | undefined}
     */
    async getTransaction(txHash) {
        let node = await this._pickNode()
        let transaction = await node.call(
            'eth_getTransactionByHash',
            [txHash]
        )

        Client._formatTransaction(transaction)

        return transaction
    }

    /**
     * Executes a new message call immediately without creating a transaction
     * on the block chain.
     * It is equivalent to RPC `eth_call`.
     *
     * @param {string} method - Method to be call.
     * @param {Array} data - Positional arguments.
     * @returns {Promise<any>}
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

    /**
     * Convert data type of attributes inplace.
     *
     * @private
     * @param {any} tx
     */
    static _formatTransaction(tx) {
        tx.blockNumber = heximalToNumber(tx.blockNumber)
        tx.transactionIndex = heximalToNumber(tx.transactionIndex)
        tx.type = heximalToNumber(tx.type)
        tx.nonce = heximalToNumber(tx.nonce)
        tx.gas = BigInt(tx.gas)
        tx.gasPrice = BigInt(tx.gasPrice)
    }
}

module.exports = {
    Client,
    ClientError
}
