# Examples

* [Client](#client)
* [Contract](#contract)

## Client

```js
'use strict'

const {Client} = require('tiny_eth_client')

async function main() {
    let endpoints = [
        'https://bsc-dataseed.binance.org/',
        'https://bsc-dataseed1.defibit.io/',
        'https://bsc-dataseed1.ninicoin.io/'
    ]
    let client = new Client({
        endpoints
    })

    await client.open()

    try {
        let logs = await client.getLogs({
            address: '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16',
            fromBlock: 13463805,
            toBlock: 13463807
        })

        console.log(logs)
    }
    finally {
        await client.close()
    }
}

main().catch(console.error)
```

## Contract

```js
'use strict'

const {Client, Contract} = require('tiny_eth_client')
const UniswapV2PoolAbi = require('../test/_data/uniswap_v2_pool_abi.json')

async function main() {
    let endpoints = [
        'https://bsc-dataseed.binance.org/',
        'https://bsc-dataseed1.defibit.io/',
        'https://bsc-dataseed1.ninicoin.io/'
    ]
    let client = new Client({
        endpoints
    })

    await client.open()

    try {
        let address = '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16'
        let contract = new Contract(address, UniswapV2PoolAbi, client)
        let decimals = await contract.call('decimals')

        console.log(decimals)
    }
    finally {
        await client.close()
    }
}


main().catch(console.error)
```
