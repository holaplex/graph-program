import * as anchor from "@project-serum/anchor";
import { Actions } from "@holaplex/graph-program";
import { getWallet } from "../tools/wallet.js";

const { revokeConnection } = Actions;

type RevokeConnectionCommandInput = {
  rpc: string;
  publicKey: string;
  solanaKeypair: string;
};

export const buildRevokeConnectionCommand =
  () => async (input: RevokeConnectionCommandInput) => {
    const wallet = await getWallet(input.solanaKeypair);
    const connection = new anchor.web3.Connection(input.rpc);
    const txId = await revokeConnection(
      new anchor.web3.PublicKey(input.publicKey),
      {
        connection,
        wallet,
      }
    );
    console.log(`Transaction ID: ${txId}`);
  };
