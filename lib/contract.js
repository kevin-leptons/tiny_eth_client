'use strict'

const {Interface} = require('@ethersproject/abi')

/**
 * * Interact with specific contract.
 */
class Contract {
    /**
     *
     * @param {EthAddressHeximal} address - Address of the contract.
     * @param {any} abi - Specifications of public methods and it's parameters
     * from a contract.
     * @param {Client} client - The contracts interact with ETH nodes
     * via this one.
     */
    constructor(address, abi, client) {
        this._address = address
        this._interface = new Interface(abi)
        this._client = client
    }

    /**
     * Call specific method on the contract.
     *
     * @param {string} method - Method to be call.
     * @param {Array} [data=[]] - Positional arguments which is pass to method.
     * @returns {Promise<any>}
     */
    async call(method, data=[], blockNumber='latest') {
        let params = [
            {
                to: this._address,
                data: this._interface.encodeFunctionData(method, data)
            },
            blockNumber
        ]
        let result = await this._client.call('eth_call', params)

        return this._interface.decodeFunctionResult(method, result)
    }
}

module.exports = {
    Contract
}
