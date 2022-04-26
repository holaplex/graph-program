# Graph Program CLI

Provides a basic cli to interact with the graph program.

## Instructions

Be sure to build the @holaplex/graph-program package `cd ../../sdk/ && yarn build` and then
remember to re-link it, especially if you're working on that package with: `file:../../sdk/` inside of this directory.

## How to make a connection

```bash
$ node ./build/index.js make-connection \
-k ~/.config/solana/mainnet-test1.json \
-p FeikG7Kui7zw8srzShhrPv2TJgwAn61GU7m8xmaK9GnW \
-r https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/
```

## How to revoke a connection

```bash
$ node ./build/index.js revoke-connection \
-k ~/.config/solana/mainnet-test1.json \
-p FeikG7Kui7zw8srzShhrPv2TJgwAn61GU7m8xmaK9GnW \
-r https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/
```

## How to query

```bash
$ node ./build/index.js get-all-connections-from \
-k ~/.config/solana/mainnet-test1.json \
-r https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/
```

```bash
$ node ./build/index.js get-all-connections-to \
-k ~/.config/solana/mainnet-test1.json \
-r https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/
```