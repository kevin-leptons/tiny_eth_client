'use strict'

const {Node} = require('./node')
const {Gateway} = require('./gateway')
const {Diary} = require('./diary')
const {heximalToNumber, numberToHeximal} = require('./formatter')
const {
    isUnsignedInteger,
    isPositiveInteger,
    isValidEndpoint,
    isTransactionHashHeximal
} = require('./validator')

/*eslint-disable no-unused-vars*/
const {
    Endpoint,
    LogFilter,
    Transaction,
    TransactionHashHeximal,
    PositiveInteger,
    UnsignedInteger,
    Block
} = require('./type')
/*eslint-enable no-unused-vars*/

/**
 * @type Endpoint
 */
const DEFAULT_ENDPOINT = {
    url: 'http://localhost:8545',
    weight: 1
}

/**
 * @typedef {object} ClientConfig
 * @property {Array<Endpoint>} [endpoints=[DEFAULT_ENDPOINT]] - List of
 * ETH RPC endpoints.
 * @property {UnsignedInteger} [reorganisationBlocks=6] - There is a block
 * `n = latest - reorganisationBlocks`. Where `latest` is newest mined block
 * number. The client will not process related things that has block number
 * greater than block number `n`.
 * @property {PositiveInteger} [healthCheckInterval=3000] - For each time
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
 * * WARN: It does not work with endpoints that does load balancing to
 *   other nodes.
 */
class Client {
    /**
     * @param {ClientConfig} config
     */
    constructor(config) {
        let validConfig = Client._standardizeConfig(config)
        let nodes = validConfig.endpoints.map((endpoint, index) => {
            return new Node({
                identity: index + 1,
                endpoint: endpoint.url,
                weight: endpoint.weight
            })
        })

        this._gateway = new Gateway(nodes, {
            healthcheckInterval: validConfig.healthCheckInterval
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
     * Safe block number `latest - reorganisationBlocks`, where
     * `latest` is newest block number from nodes.
     *
     * @returns {number}
     */
    get blockNumber() {
        return this._gateway.safeBlockNumber
    }

    /**
     *
     * @param {UnsignedInteger} blockNumber
     * @param {boolean} [includeTransaction=false]
     * @returns {Promise<Block>}
     */
    async getBlockByNumber(blockNumber, includeTransaction=false) {
        if (!isUnsignedInteger(blockNumber)) {
            throw new TypeError('not a unsigned integer')
        }

        let node = this._pickNode()
        let blockNumberHeximal = numberToHeximal(blockNumber)

        if (blockNumberHeximal === undefined) {
            throw new ClientError('invalid block number')
        }

        let block = await node.call(
            'eth_getBlockByNumber',
            [blockNumberHeximal, includeTransaction]
        )

        return Client._standardizeBlock(block)
    }

    /**
     * Retrieve log records.
     * It is equivalent to RPC `eth_getLogs`.
     *
     * @param {LogFilter} filter - Matching conditions.
     * @returns {Promise<Array<Log>>}
     * @throws {DiaryError} - Call to unsafe block.
     */
    async getLogs(filter) {
        return await this._diary.getLogs(filter)
    }

    /**
     * Retrieve a transaction by it's hash.
     * It is equivalent to RPC `eth_getTransactionByHash`.
     *
     * @param {TransactionHashHeximal} txHash
     * @returns {Transaction | undefined}
     * @throws {ClientError}
     */
    async getTransaction(txHash) {
        if (!isTransactionHashHeximal(txHash)) {
            throw new TypeError('not a transaction hash heximal')
        }

        let node = this._pickNode()
        let transaction = await node.call(
            'eth_getTransactionByHash',
            [txHash]
        )

        Client._formatTransaction(transaction)

        if (transaction.blockNumber > this._gateway.blockNumber) {
            throw new ClientError('unsafe block number calling')
        }

        return transaction
    }

    /**
     * Executes a new message call immediately without creating a transaction
     * on the block chain.
     * It is equivalent to RPC `eth_call`.
     *
     * @private
     * @param {string} method - Method to be call.
     * @param {Array} data - Positional arguments.
     * @returns {Promise<any>}
     */
    async _call(method, data) {
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
     * @throws {ClientError}
     */
    static _standardizeConfig(config={}) {
        let invalidName = Client._getInvalidConfigAttributeName(config)

        if (invalidName) {
            throw new ClientError('not accepted config.' + invalidName)
        }

        let validConfig = {
            endpoints: [DEFAULT_ENDPOINT],
            reorganisationBlocks: 6,
            healthCheckInterval: 3000
        }

        Object.assign(validConfig, config)

        Client._validateEndpoints(validConfig.endpoints)

        if (!isUnsignedInteger(validConfig.reorganisationBlocks)) {
            throw new ClientError('invalid config.reorganisationBlocks')
        }

        if (!isPositiveInteger(validConfig.healthCheckInterval)) {
            throw new ClientError('invalid config.healthCheckInterval')
        }

        return validConfig
    }

    /**
     * @private
     * @param {any} config
     * @returns {string}
     */
    static _getInvalidConfigAttributeName(config) {
        let acceptedNames = [
            'endpoints',
            'reorganisationBlocks',
            'healthCheckInterval'
        ]
        let names = Object.keys(config)

        for (let name of names) {
            if (!acceptedNames.includes(name)) {
                return name
            }
        }

        return undefined
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

    /**
     * @private
     * @param {Array<Endpoint>} endpoints
     * @throws {ClientError}
     */
    static _validateEndpoints(endpoints) {
        if (!Array.isArray(endpoints) || endpoints.length === 0) {
            throw new ClientError('invalid config.endpoints')
        }

        for (let i = 0; i < endpoints.length; ++i) {
            if (!isValidEndpoint(endpoints[i])) {
                throw new ClientError(`invalid config.endpoints[${i}]`)
            }
        }
    }

    /**
     * @private
     * @param {Block} block
     * @returns {Block}
     */
    static _standardizeBlock(block) {
        block.number = heximalToNumber(block.number)
        block.timestamp = heximalToNumber(block.timestamp)

        return block
    }
}

module.exports = {
    Client,
    ClientError
}
