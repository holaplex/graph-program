import { web3, Wallet } from "@project-serum/anchor";
import { readFile } from "fs/promises";

export const getWalletFromKeyPairFile = async (keyPairFile: string) => {
  const payer = web3.Keypair.fromSecretKey(
    Buffer.from(
      JSON.parse(
        await readFile(keyPairFile, {
          encoding: "utf-8",
        })
      )
    )
  );
  return new Wallet(payer);
};
