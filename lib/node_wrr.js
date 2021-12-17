'use strict'

const computeGcd = require('compute-gcd')

/**
 * * NodeWrr mean Node Weighted Round Robin.
 * * Pick a node from a set of nodes by Weighted Round Robin.
 *
 * @private
 */
class NodeWrr {
    /**
     *
     * @param {Array<Node>} nodes
     */
    constructor(nodes=[]) {
        this._initiallize(nodes)
    }

    /**
     *
     * @param {Array<Node>} nodes
     */
    update(nodes=[]) {
        if (NodeWrr._isIdentialNodeList(nodes, this._nodes)) {
            this._initiallize(nodes)
        }

        this._updateBlockNumber()
    }

    /**
     * @returns {number | undefined}
     */
    get blockNumber() {
        return this._blockNumber
    }

    /**
     * This implementation is build on algorithm here:
     * http://kb.linuxvirtualserver.org/wiki/Weighted_Round-Robin_Scheduling
     *
     * @returns {Node | undefined}
     */
    pick() {
        if (this._nodes.length === 0) {
            return undefined
        }

        /*eslint-disable max-depth*/
        for (;;) {
            this._currentIndex = (this._currentIndex + 1) % this._nodes.length

            let node = this._pickCurrentNode()

            switch (node) {
                case undefined: return undefined
                case null: continue
                default: return node
            }
        }
    }

    /**
     *
     * @returns {Node | undefined | null}
     */
    _pickCurrentNode() {
        if (this._currentIndex === 0) {
            this._currentWeight = this._currentWeight - this._gcdWeight

            if (this._currentWeight <= 0) {
                this._currentWeight = this._maxWeight

                if (this._currentWeight === 0) {
                    return undefined
                }
            }
        }

        let node = this._nodes[this._currentIndex]

        return (node.weight >= this._currentWeight)
            ? node
            : null
    }

    /**
     *
     * @param {Array<Node>} nodes
     */
    _initiallize(nodes) {
        this._nodes = nodes
        this._currentIndex = -1
        this._currentWeight = 0
        this._maxWeight = NodeWrr._getMaxWeight(this._nodes)
        this._gcdWeight = NodeWrr._getGcdWeight(this._nodes)
    }

    /**
     * Update latest block number.
     *
     * @returns {undefined}
     */
    _updateBlockNumber() {
        this._blockNumber = (this._nodes.length > 0)
            ? this._nodes[0].blockNumber
            : undefined
    }

    /**
     *
     * @param {Array<Node>} list1
     * @param {Array<Node>} list2
     * @returns {boolean}
     */
    static _isIdentialNodeList(list1, list2) {
        if (list1.length !== list2.length) {
            return true
        }

        for (let i = 0; i < list1.length; ++i) {
            if (list1[i].identity !== list2[i].identity) {
                return true
            }
        }

        return false
    }

    /**
     * @private
     * @param {Array<Node>} nodes
     * @returns {number}
     */
    static _getMaxWeight(nodes) {
        let result = 0

        for (let node of nodes) {
            if (node.weight > result) {
                result = node.weight
            }
        }

        return result
    }

    /**
     * @private
     * @param {Array<Node>} nodes
     * @returns {number}
     */
    static _getGcdWeight(nodes) {
        let weights = nodes.map(node => node.weight)

        return computeGcd(weights)
    }
}

module.exports = {
    NodeWrr
}
