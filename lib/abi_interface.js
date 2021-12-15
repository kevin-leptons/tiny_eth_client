'use strict'

const {Interface} = require('@ethersproject/abi')

/**
 * * The Interface Class abstracts the encoding and decoding required to
 *   interact with contracts on the Ethereum network.
 * * This class is the same as
 *   [ethers.Interface](https://docs.ethers.io/v5/api/utils/abi/interface/).
 */
class AbiInterface extends Interface {
    /**
     *
     * @param {any} abi - Specifications of public methods and it's parameters
     * from a contract.
     */
    constructor(abi) {
        super(abi)
    }
}

module.exports = {
    AbiInterface
}
