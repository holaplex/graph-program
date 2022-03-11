import * as anchor from "@project-serum/anchor";
import { getWallet } from "../tools/wallet.js";
import { Actions } from "@holaplex/graph-program";

const { makeConnection } = Actions;

type MakeConnectionCommandInput = {
  rpc: string;
  publicKey: string;
  solanaKeypair: string;
};

export const buildMakeConnectionCommand =
  () => async (input: MakeConnectionCommandInput) => {
    const wallet = await getWallet(input.solanaKeypair);
    const connection = new anchor.web3.Connection(input.rpc);
    const txId = await makeConnection(
      new anchor.web3.PublicKey(input.publicKey),
      {
        connection,
        wallet,
      }
    );
    console.log(`Transaction ID: ${txId}`);
  };
