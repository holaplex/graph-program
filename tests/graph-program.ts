import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";

import { GraphProgram } from "../target/types/graph_program";
import { b } from "./helpers/string";

const expect = require("chai").expect;

const getConnectionPDA = (
  from: anchor.web3.PublicKey,
  to: anchor.web3.PublicKey,
  program: anchor.Program<GraphProgram>
) =>
  anchor.web3.PublicKey.findProgramAddress(
    [b`connection`, from.toBytes(), to.toBytes()],
    program.programId
  );

const getConnectionV2PDA = (
  from: anchor.web3.PublicKey,
  to: anchor.web3.PublicKey,
  program: anchor.Program<GraphProgram>
) =>
  anchor.web3.PublicKey.findProgramAddress(
    [b`connectionv2`, from.toBytes(), to.toBytes()],
    program.programId
  );

describe("graph-program", () => {
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.GraphProgram as Program<GraphProgram>;

  const fromWallet = anchor.Wallet.local();
  const from = fromWallet.publicKey;
  const to = anchor.web3.Keypair.generate().publicKey;

  it("makes_connections", async () => {
    // No need to derive PDA here thanks to Seeds feature!
    const txId = await program.methods
      .makeConnection(to)
      .accounts({ from })
      .rpc();
    expect(!!txId).to.be.true;
    const [pda] = await getConnectionV2PDA(from, to, program);
    const connection = await program.account.connectionV2.fetch(pda);
    expect(connection.disconnectedAt).to.be.null;
  });

  it("revokes_connections", async () => {
    const [pda, bump] = await getConnectionV2PDA(from, to, program);
    const txId = await program.methods
      .revokeConnection(bump, to)
      .accounts({ from })
      .rpc();
    expect(!!txId).to.be.true;
    const connection = await program.account.connectionV2.fetch(pda);
    expect(!!connection.disconnectedAt).to.be.true;
  });

  it("closes_connections", async () => {
    const [pda, bump] = await getConnectionV2PDA(from, to, program);
    const wallet = new anchor.Wallet(anchor.web3.Keypair.generate());
    const txId = await program.methods
      .closeConnection(bump, to)
      .accounts({
        connection: pda,
        from,
        signer: wallet.publicKey, // Different signer
      })
      .signers([wallet.payer])
      .rpc();
    expect(!!txId).to.be.true;
    const connection = await program.account.connectionV2.fetchNullable(pda);
    expect(connection).to.be.null;
  });
});
