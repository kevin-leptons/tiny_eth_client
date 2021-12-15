'use strict'

const {NodeStatus} = require('./node')

const {GateWayConfig} = require('./type')
const {Node, NodeStat} = require('./node')

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
     * @returns {Promise<Node | undefined>}
     */
    pickNode() {
        if (!this._healthyNodes) {
            throw new GatewayError('not open yet')
        }

        return this._healthyNodes[0].node
    }

    /**
     * @private
     */
    async _updateStateNodes() {
        let tasks = this._nodes.map(this._getTrackedNode)
        let trackedNodes = await Promise.all(tasks)

        this._healthyNodes = trackedNodes
            .filter(node => (node.stat.status === NodeStatus.OK))
            .sort((n1, n2) => (n2.stat.latestBlock - n1.stat.latestBlock))
    }

    /**
     * @private
     * @param {Node} node
     * @returns {Array<TrackedNode>}
     */
    async _getTrackedNode(node) {
        return {
            stat: await node.getStat(),
            node: node
        }
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
}

module.exports = {
    Gateway,
    GatewayError
}
