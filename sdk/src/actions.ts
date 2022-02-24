import { web3 } from "@project-serum/anchor";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import {
  createMakeConnectionTransaction,
  createRevokeConnectionTransaction,
} from "./transactions";

export type WalletAndConnection = {
  wallet: Wallet;
  connection: web3.Connection;
};

export const makeConnection = async (
  to: web3.PublicKey,
  walletAndConnection: WalletAndConnection
) => {
  const tx = await createMakeConnectionTransaction(to, walletAndConnection);
  const { blockhash } =
    await walletAndConnection.connection.getRecentBlockhash();
  tx.feePayer = walletAndConnection.wallet.publicKey;
  tx.recentBlockhash = blockhash;
  const signedTX = await walletAndConnection.wallet.signTransaction(tx);
  return walletAndConnection.connection.sendRawTransaction(
    signedTX.serialize()
  );
};

export const revokeConnection = async (
  to: web3.PublicKey,
  walletAndConnection: WalletAndConnection
) => {
  const tx = await createRevokeConnectionTransaction(to, walletAndConnection);
  const { blockhash } =
    await walletAndConnection.connection.getRecentBlockhash();
  tx.feePayer = walletAndConnection.wallet.publicKey;
  tx.recentBlockhash = blockhash;
  const signedTX = await walletAndConnection.wallet.signTransaction(tx);
  return walletAndConnection.connection.sendRawTransaction(
    signedTX.serialize()
  );
};
