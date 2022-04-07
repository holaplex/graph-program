Graph Program CLI
=================

Graph Program CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @holaplex/graph-program-cli
$ graph COMMAND
running command...
$ graph (-v|--version|version)
@holaplex/graph-program-cli/0.2.0 linux-x64 node-v16.14.2
$ graph --help [COMMAND]
USAGE
  $ graph COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`graph close-connection [FROM] [TO]`](#graph-close-connection-from-to)
* [`graph help [COMMAND]`](#graph-help-command)
* [`graph make-connection [TO]`](#graph-make-connection-to)
* [`graph query-connections-from [FROM]`](#graph-query-connections-from-from)
* [`graph query-connections-to [TO]`](#graph-query-connections-to-to)
* [`graph revoke-connection [TO]`](#graph-revoke-connection-to)

## `graph close-connection [FROM] [TO]`

Closes a connection and refunds the rent excemption.

```
USAGE
  $ graph close-connection [FROM] [TO]

OPTIONS
  -e, --endpoint=endpoint  (required) RPC Endpoint
  -k, --keypair=keypair    (required) Solana Keypair

EXAMPLE
  graph close-connection
```

_See code: [dist/commands/close-connection.ts](https://github.com/holaplex/graph-program/blob/v0.2.0/dist/commands/close-connection.ts)_

## `graph help [COMMAND]`

Display help for graph.

```
USAGE
  $ graph help [COMMAND]

ARGUMENTS
  COMMAND  Command to show help for.

OPTIONS
  -n, --nested-commands  Include all nested commands in the output.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `graph make-connection [TO]`

Makes a connection.

```
USAGE
  $ graph make-connection [TO]

OPTIONS
  -e, --endpoint=endpoint  (required) RPC Endpoint
  -k, --keypair=keypair    (required) Solana Keypair

EXAMPLE
  graph make-connection
```

_See code: [dist/commands/make-connection.ts](https://github.com/holaplex/graph-program/blob/v0.2.0/dist/commands/make-connection.ts)_

## `graph query-connections-from [FROM]`

Gets all connections from the given input

```
USAGE
  $ graph query-connections-from [FROM]

OPTIONS
  -e, --endpoint=endpoint  (required) RPC Endpoint
  -x, --extended           show extra columns
  --columns=columns        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --filter=filter          filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=csv|json|yaml   output in a more machine friendly format
  --sort=sort              property to sort by (prepend '-' for descending)

EXAMPLE
  graph query-connections-from
```

_See code: [dist/commands/query-connections-from.ts](https://github.com/holaplex/graph-program/blob/v0.2.0/dist/commands/query-connections-from.ts)_

## `graph query-connections-to [TO]`

Gets all connections to the given input

```
USAGE
  $ graph query-connections-to [TO]

OPTIONS
  -e, --endpoint=endpoint  (required) RPC Endpoint
  -x, --extended           show extra columns
  --columns=columns        only show provided columns (comma-separated)
  --csv                    output is csv format [alias: --output=csv]
  --filter=filter          filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --output=csv|json|yaml   output in a more machine friendly format
  --sort=sort              property to sort by (prepend '-' for descending)

EXAMPLE
  graph query-connections-to
```

_See code: [dist/commands/query-connections-to.ts](https://github.com/holaplex/graph-program/blob/v0.2.0/dist/commands/query-connections-to.ts)_

## `graph revoke-connection [TO]`

Revokes a connection and marks it available to close.

```
USAGE
  $ graph revoke-connection [TO]

OPTIONS
  -e, --endpoint=endpoint  (required) RPC Endpoint
  -k, --keypair=keypair    (required) Solana Keypair

EXAMPLE
  graph revoke-connection
```

_See code: [dist/commands/revoke-connection.ts](https://github.com/holaplex/graph-program/blob/v0.2.0/dist/commands/revoke-connection.ts)_
<!-- commandsstop -->
