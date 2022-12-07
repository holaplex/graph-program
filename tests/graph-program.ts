import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";

import { GraphProgram } from "../target/types/graph_program";
import { b } from "./helpers/string";

const expect = require("chai").expect;

const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

const getConnectionsStoragePDA = (
  from: anchor.web3.PublicKey,
  program: anchor.Program<GraphProgram>
) =>
  anchor.web3.PublicKey.findProgramAddress(
    [b`connections`, from.toBytes()],
    program.programId
  );

describe("graph-program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.GraphProgram as Program<GraphProgram>;
  const fromWallet = anchor.Wallet.local();
  const signer = fromWallet.publicKey;
  const to = anchor.web3.Keypair.generate().publicKey;
  it("creates_connections_storage", async () => {
    const [pda] = await getConnectionsStoragePDA(signer, program);
    const txId = await program.methods
      .createConnectionsStorage()
      .accountsStrict({
        signer,
        storage: pda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    expect(!!txId).to.be.true;
    const storage = await program.account.connectionsStorage.fetch(pda);
    expect(storage.connections.length).to.be.equal(0);
  });
  it("creates_connections", async () => {
    const [pda] = await getConnectionsStoragePDA(signer, program);
    const txId = await program.methods
      .createConnection(to)
      .accountsStrict({
        signer,
        storage: pda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    expect(!!txId).to.be.true;
  });
  it("removes_connections", async () => {
    const [pda] = await getConnectionsStoragePDA(signer, program);
    const txId = await program.methods
      .removeConnection(to)
      .accountsStrict({
        signer,
        storage: pda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    expect(!!txId).to.be.true;
  });
});
