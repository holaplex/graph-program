# Graph Program CLI

Provides a basic cli to interact with the graph program.

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