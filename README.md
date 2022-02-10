# Graph Program

![Image](https://images.unsplash.com/photo-1594047752131-1ec0a6dfa4fc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&h=250&w=1500)

A program to connect accounts with public keys that allows for the creation of a very flexible graph structure on the blockchain.

Table of contents:

- [Source Code](#source-code)
- [Usage](#usage)

## Source Code

The `programs/graph_program/lib.rs` file acts as an entry point to the graph program.

- Instructions are laid out in the `programs/graph_program/instructions` folder, which acts as a module (be sure to list each instructions in the `mod.rs` file).
- Altough Solana Programs are stateless, the `"State"` structs and impls are stored in `programs/graph_program/state`, likewise list them on `mod.rs`. Here is where a lot of the business logic related to structs that are passed as accounts into the program by the instructions should live and function.
- Constants are stored in the `programs/graph_program/constants` folder, here is where we store some useful constants like PDA seed parts and static pubKeys.

## Usage

Docs and Sdk in the making, please refer to the `tests` folder for implementation reference.

## Questions

[ksolano@holaplex.com](mailto::ksolano@holaplex.com)
