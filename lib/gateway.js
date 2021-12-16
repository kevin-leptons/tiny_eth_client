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
        this._nodePointer = undefined
        this._nodeWrr = new NodeWrr()
    }

    async open() {
        let updateStateNodes = this._updateStateNodes.bind(this)

        await updateStateNodes()
        this._updateStateNodesTimer = setInterval(
            () => {
                updateStateNodes().catch(console.error)
            },
            this._healthcheckInterval
        )
    }

    // eslint-disable-next-line require-await
    async close() {
        if (this._updateStateNodesTimer) {
            clearInterval(this._updateStateNodesTimer)
            this._updateStateNodesTimer = undefined
        }
    }

    /**
     * @returns {number | undefined}
     */
    get latestBlockNumer() {
        return this._nodeWrr.latestBlockNumer
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
    async _updateStateNodes() {
        let tasks = this._nodes.map(node => node.updateStat())

        await Promise.all(tasks)

        let healthyNodes = this._nodes.filter(node => {
            return node.status === NodeStatus.OK
        })
        let topNodes = Gateway._pickTopNodes(healthyNodes)

        this._nodeWrr.update(topNodes)
    }

    /**
     * @private
     * @param {object} config
     * @returns {GateWayConfig}
     */
    static _standardizeConfig(config) {
        let defaultConfig = {
            healthcheckInterval: 3000
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
            if (node.latestBlockNumer === topBlockNumber) {
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

        let result = nodes[0].latestBlockNumer

        for (let node of nodes) {
            if (node.latestBlockNumer > result) {
                result = node.latestBlockNumer
            }
        }

        return result
    }
}

module.exports = {
    Gateway,
    GatewayError
}
