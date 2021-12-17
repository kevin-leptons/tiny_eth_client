# Getting Started

* [Client](#client)
* [Contract](#contract)

## Client

```js
async function main() {
    let endpoints = [
        {
            url: 'https://bsc-dataseed.binance.org/',
            weight: 1
        },
        {
            url: 'https://bsc-dataseed1.defibit.io/',
            weight: 3
        },
        {
            url: 'https://bsc-dataseed1.ninicoin.io/',
            weight: 2
        }
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

        console.log(logs, client.blockNumber)
    }
    finally {
        await client.close()
    }
}

main().catch(console.error)
```

## Contract

```js
async function main() {
    let endpoints = [
        {
            url: 'https://bsc-dataseed.binance.org/',
            weight: 1
        },
        {
            url: 'https://bsc-dataseed1.defibit.io/',
            weight: 3
        },
        {
            url: 'https://bsc-dataseed1.ninicoin.io/',
            weight: 2
        }
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
