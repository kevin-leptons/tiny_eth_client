'use strict'

const {NodeStatus} = require('./node')
const {NodeWrr} = require('./node_wrr')

/*eslint-disable no-unused-vars*/
const {GateWayConfig} = require('./type')
const {Node, NodeStat} = require('./node')
/*eslint-enable no-unused-vars*/

/**
 * @typedef {object} TrackedNode
 * @property {NodeStat} stat
 * @property {Node} node
 */

class GatewayError extends Error {
    constructor(message) {
        super(message)
        this.name = 'GatewayError'
    }
}

/**
 * @private
 */
class Gateway {
    /**
     * @param {Array<Node>} nodes
     * @param {GateWayConfig} config
     */
    constructor(nodes, config) {
        let validConfig = Gateway._standardizeConfig(config)

        this._nodes = nodes
        this._healthcheckInterval = validConfig.healthcheckInterval
        this._reorganisationBlock = validConfig.reorganisationBlocks
        this._nodeWrr = new NodeWrr()
    }

    async open() {
        let updateStateNodes = this._updateStatNodes.bind(this)

        await updateStateNodes()
        this._updateStatNodesTimer = setInterval(
            () => {
                updateStateNodes().catch(console.error)
            },
            this._healthcheckInterval
        )
    }

    // eslint-disable-next-line require-await
    async close() {
        if (this._updateStatNodesTimer) {
            clearInterval(this._updateStatNodesTimer)
            this._updateStatNodesTimer = undefined
        }
    }

    /**
     * @returns {number | undefined}
     */
    get blockNumber() {
        return this._nodeWrr.blockNumber
    }

    get safeBlockNumber() {
        return this._safeBlockNumber
    }

    /**
     * @returns {Promise<Node | undefined>}
     */
    pickNode() {
        return this._nodeWrr.pick()
    }

    /**
     * @private
     */
    async _updateStatNodes() {
        let tasks = this._nodes.map(node => node.updateStat())

        await Promise.all(tasks)

        let healthyNodes = this._nodes.filter(node => {
            return node.status === NodeStatus.OK
        })
        let topNodes = Gateway._pickTopNodes(healthyNodes)

        this._nodeWrr.update(topNodes)
        this._updateSafeBlockNumber()
    }

    /**
     * Update attribute "_safeBlockNumber".
     *
     * @returns {undefined}
     */
    _updateSafeBlockNumber() {
        let safeBlockNumber =
            this._nodeWrr.blockNumber - this._reorganisationBlock

        if (!Number.isInteger(safeBlockNumber) || safeBlockNumber < 0) {
            this._safeBlockNumber = undefined

            return
        }

        this._safeBlockNumber = safeBlockNumber
    }

    /**
     * @private
     * @param {object} config
     * @returns {GateWayConfig}
     */
    static _standardizeConfig(config) {
        let defaultConfig = {
            healthcheckInterval: 3000,
            reorganisationBlocks: 6
        }

        return Object.assign(defaultConfig, config)
    }

    /**
     *
     * @param {Array<Node>} nodes
     * @returns {Array<Node>}
     */
    static _pickTopNodes(nodes) {
        let topBlockNumber = Gateway._getTopBlockNumber(nodes)
        let result = []

        for (let node of nodes) {
            if (node.blockNumber === topBlockNumber) {
                result.push(node)
            }
        }

        return result
    }

    /**
     *
     * @param {Array<Node>} nodes
     * @returns {number | undefined}
     */
    static _getTopBlockNumber(nodes) {
        if (nodes.length === 0) {
            return undefined
        }

        let result = nodes[0].blockNumber

        for (let node of nodes) {
            if (node.blockNumber > result) {
                result = node.blockNumber
            }
        }

        return result
    }
}

module.exports = {
    Gateway,
    GatewayError
}
