import * as anchor from "@project-serum/anchor";
import { Program, Helpers } from "@holaplex/graph-program";
import { getWallet } from "../tools/wallet.js";

const { getConnectionPDA } = Helpers;
const { getGraphProgram } = Program;

type CloseConnectionCommandInput = {
  rpc: string;
  solanaKeypair: string;
  toPublicKey: string;
  fromPublicKey: string;
};

export const buildCloseConnectionCommand =
  () => async (input: CloseConnectionCommandInput) => {
    const toPubkey = new anchor.web3.PublicKey(input.toPublicKey);
    const fromPubkey = new anchor.web3.PublicKey(input.toPublicKey);

    const wallet = await getWallet(input.solanaKeypair);
    const connection = new anchor.web3.Connection(input.rpc);

    const graphProgram = getGraphProgram(
      new anchor.AnchorProvider(connection, wallet, {})
    );

    const [pda, bump] = await getConnectionPDA(fromPubkey, toPubkey);

    const txId = await graphProgram.methods
      .closeConnection(bump, toPubkey)
      .accounts({
        connection: pda,
        from: fromPubkey,
        signer: wallet.publicKey,
      })
      .rpc();

    console.log(`Transaction ID: ${txId}`);
  };
