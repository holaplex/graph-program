import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { GraphProgram } from "../target/types/graph_program";

describe("graph-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.GraphProgram as Program<GraphProgram>;

  it("makes connections", async () => {
    // Add your test here.
    const tx = await program.rpc.makeConnection({})
    console.log("Your transaction signature", tx);
  });

  it("revokes connections", async () => {});
});
