import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";

import { GraphProgram } from "../target/types/graph_program";
import { b } from "./helpers/string";

const expect = require("chai").expect;

describe("graph-program", () => {
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.GraphProgram as Program<GraphProgram>;

  const fromWallet = anchor.Wallet.local();
  const from = fromWallet.publicKey;
  const to = anchor.web3.Keypair.generate().publicKey;

  it("makes_and_removes_connections", async () => {
    const [connection, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [b`connection`, from.toBytes(), to.toBytes()],
      program.programId
    );

    const makeTX = await program.rpc.makeConnection(to, {
      accounts: {
        from,
        connection: connection,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [fromWallet.payer],
    });
    expect(!!makeTX).to.be.true;

    const created = await program.account.connection.fetch(connection);
    expect(created.to.toBase58()).equal(to.toBase58());
    expect(created.from.toBase58()).equal(from.toBase58());

    const revokeTX = await program.rpc.revokeConnection(bump, to, {
      accounts: {
        from,
        connection,
      },
      signers: [fromWallet.payer],
    });

    expect(!!revokeTX).to.be.true;
    try {
      await program.account.connection.fetch(connection);
    } catch (error) {
      expect(error.message).equal(
        `Account does not exist ${connection.toBase58()}`
      );
    }
  });
});
