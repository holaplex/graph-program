import * as anchor from "@project-serum/anchor";
import { Program, Helpers } from "@holaplex/graph-program";
import { getWallet } from "../tools/wallet.js";

const { getConnectionPDA } = Helpers;
const { getGraphProgram } = Program;

type RevokeConnectionCommandInput = {
  rpc: string;
  publicKey: string;
  solanaKeypair: string;
};

export const buildRevokeConnectionCommand =
  () => async (input: RevokeConnectionCommandInput) => {
    const toPubkey = new anchor.web3.PublicKey(input.publicKey);
    const wallet = await getWallet(input.solanaKeypair);
    const connection = new anchor.web3.Connection(input.rpc);
    const graphProgram = getGraphProgram(
      new anchor.AnchorProvider(connection, wallet, {})
    );
    const [pda, bump] = await getConnectionPDA(wallet.publicKey, toPubkey);
    const txId = await graphProgram.methods
      .revokeConnection(bump, toPubkey)
      .accounts({
        connection: pda,
        from: wallet.publicKey,
      })
      .rpc();
    console.log(`Transaction ID: ${txId}`);
  };
