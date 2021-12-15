'use strict'

const {Interface} = require('@ethersproject/abi')

class Contract {
    /**
     *
     * @param {EthAddressHeximal} address
     * @param {Array | object} abi
     * @param {Client} client
     */
    constructor(address, abi, client) {
        this._address = address
        this._interface = new Interface(abi)
        this._client = client
    }

    /**
     *
     * @param {string} method
     * @param {Array} data
     * @returns {Promise<Array | object>}
     */
    async call(method, data=[], blockNumber='latest') {
        let params = [
            {
                to: this._address,
                data: this._interface.encodeFunctionData(method, data)
            },
            blockNumber
        ]
        let result = await this._client.call(params)

        return this._interface.decodeFunctionResult(method, result)
    }
}

module.exports = {
    Contract
}
