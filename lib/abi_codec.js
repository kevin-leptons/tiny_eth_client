'use strict'

const {Interface} = require('@ethersproject/abi')

/**
 * * Encode and decode data from [ETH JSON RPC](https://eth.wiki/json-rpc/API).
 * * This class is the same as
 *   [ethers.Interface](https://docs.ethers.io/v5/api/utils/abi/interface/).
 */
class AbiCodec extends Interface {
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
    AbiCodec
}
