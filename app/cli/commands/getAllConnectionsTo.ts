import * as anchor from "@project-serum/anchor";
import { getWallet } from "../tools/wallet.js";
import { Queries } from "@holaplex/graph-program";

const { getAllConnectionsTo } = Queries;

type GetAllConnectionsToInput = {
  rpc: string;
  solanaKeypair: string;
};

export const buildGetAllConnectionsToCommand =
  () => async (input: GetAllConnectionsToInput) => {
    const wallet = await getWallet(input.solanaKeypair);
    const connection = new anchor.web3.Connection(input.rpc);
    const results = await getAllConnectionsTo(wallet.publicKey, {
      wallet,
      connection,
    });
    const map = results.map(({ account: { from, to }, publicKey }) => ({
      publicKey: publicKey.toBase58(),
      from: from.toBase58(),
      to: to.toBase58(),
    }));
    console.log(map);
  };
