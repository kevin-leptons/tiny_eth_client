'use strict'

const assert = require('assert')
const {Node} = require('../lib/node')
const {NodeWrr} = require('../lib/node_wrr')

describe('NodeWrr', () => {
    it('pick right nodes', () => {
        let node1 = new Node({identity: 1, weight: 1})
        let node2 = new Node({identity: 2, weight: 5})
        let node3 = new Node({identity: 3, weight: 3})
        let node4 = new Node({identity: 4, weight: 9})
        let node5 = new Node({identity: 5, weight: 4})
        let node6 = new Node({identity: 6, weight: 3})
        let node7 = new Node({identity: 7, weight: 1})
        let nodes = [node1, node2, node3, node4, node5, node6, node7]
        let totalWeight = nodes.reduce((total, node) => {
            return total + node.weight
        }, 0)
        let nodeWrr = new NodeWrr(nodes)
        let expectedResult = [
            4, 4, 4, 4, 2, 4, 2, 4,
            5, 2, 3, 4, 5, 6, 2, 3,
            4, 5, 6, 1, 2, 3, 4, 5,
            6, 7
        ]
        let actualResult = []

        for (let i = 1; i <= totalWeight; ++i) {
            let node = nodeWrr.pick()

            actualResult.push(node.identity)
        }

        assert.deepStrictEqual(actualResult, expectedResult)
    })
})
