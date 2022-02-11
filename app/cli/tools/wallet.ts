import * as anchor from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import fs from "fs/promises";

export const getWallet = async (keyPairFile: string) => {
  const payer = anchor.web3.Keypair.fromSecretKey(
    Buffer.from(
      JSON.parse(
        await fs.readFile(keyPairFile, {
          encoding: "utf-8",
        })
      )
    )
  );
  return new NodeWallet(payer);
};
