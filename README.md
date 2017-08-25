## Matryx Token

```
Total Supply: 314,159,265 MTX
Name: MatryxToken
Symbol: MTX
Ether Cap: 161,803 Eth
```

## Requirements

npm/node
truffle

## Install

```npm i```

## Compile Contracts

```node node_modules/truffle/build/cli.bundled.js compile```

## Deploy Contracts

Set unix epoch for start and end time

```node node_modules/truffle/build/cli.bundled.js migrate```

## Test

install testrpc

```
npm install -g ethereumjs-testrpc

```

Run testrpc chain

ex
```
testrpc -b 3 --account="0xfb3e9faaad6f2f60019b725b9aef5a29a418945b00004201a93c353981889d,200000000000000000000" --account="0xb6485e6830a5d9aff97fa9d799c16aa9e387a2eea684c4b7d2c9f656798e2710,200000000000000000000"
```

set test bool to true in /migrations/2_deploy_contracts.js
run truffle tests

```node node_modules/truffle/build/cli.bundled.js test```

## TODO

- Customer serverside UUID and database?
- upgrade path
- Finalization logic
- write unit tests

