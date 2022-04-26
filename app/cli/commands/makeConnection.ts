import * as anchor from "@project-serum/anchor";
import { getWallet } from "../tools/wallet.js";
import { Program } from "@holaplex/graph-program";

const { getGraphProgram } = Program;

type MakeConnectionCommandInput = {
  rpc: string;
  publicKey: string;
  solanaKeypair: string;
};

export const buildMakeConnectionCommand =
  () => async (input: MakeConnectionCommandInput) => {
    const toPubkey = new anchor.web3.PublicKey(input.publicKey);
    const wallet = await getWallet(input.solanaKeypair);
    const connection = new anchor.web3.Connection(input.rpc);
    const graphProgram = getGraphProgram(
      new anchor.AnchorProvider(connection, wallet, {})
    );
    const txId = await graphProgram.methods
      .makeConnection(toPubkey)
      .accounts({ from: wallet.publicKey })
      .rpc();
    console.log(`Transaction ID: ${txId}`);
  };
