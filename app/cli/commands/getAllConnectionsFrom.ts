import * as anchor from "@project-serum/anchor";
import { getWallet } from "../tools/wallet.js";
import { Queries } from "@holaplex/graph-program";

const { getAllConnectionsFrom } = Queries;

type GetAllConnectionsFromInput = {
  rpc: string;
  solanaKeypair: string;
};

export const buildGetAllConnectionsFromCommand =
  () => async (input: GetAllConnectionsFromInput) => {
    const wallet = await getWallet(input.solanaKeypair);
    const connection = new anchor.web3.Connection(input.rpc);
    const results = await getAllConnectionsFrom(wallet.publicKey, {
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
