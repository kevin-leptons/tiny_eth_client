'use strict'

const {AbiCodec} = require('./abi_codec')
const {isEthAddressHeximal, isAbi} = require('./validator')
const {Client} = require('./client')

/*eslint-disable no-unused-vars*/
const {EthAddressHeximal, Abi} = require('./type')
/*eslint-enable no-unused-vars*/

class ContractError extends Error {
    constructor(message) {
        super(message)
        this.name = 'ContractError'
    }
}

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
     * @throws {ClientError}
     */
    constructor(address, abi, client) {
        Contract._validateConstructorParams(
            address,
            abi,
            client
        )

        this._address = address
        this._abiCodec = new AbiCodec(abi)
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
                data: this._abiCodec.encodeFunctionData(method, data)
            },
            blockNumber
        ]
        let result = await this._client._call('eth_call', params)

        return this._abiCodec.decodeFunctionResult(method, result)
    }

    /**
     * @private
     * @param {EthAddressHeximal} address
     * @param {Abi} abi
     * @param {Client} client
     * @throws {ClientError}
     */
    static _validateConstructorParams(address, abi, client) {
        if (!isEthAddressHeximal(address)) {
            throw new ContractError('invalid address')
        }

        if (!isAbi(abi)) {
            throw new ContractError('invalid abi')
        }

        if (!(client instanceof Client)) {
            throw new ContractError('invalid client')
        }
    }
}

module.exports = {
    Contract,
    ContractError
}
