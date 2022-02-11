import { Wallet, web3 } from "@project-serum/anchor";
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
  { wallet, connection: web3Connection }: WalletAndConnection
) => {
  const tx = await createMakeConnectionTransaction(wallet, to);
  const signedTX = await wallet.signTransaction(tx);
  return web3Connection.sendTransaction(signedTX, []);
};

export const revokeConnection = async (
  to: web3.PublicKey,
  { wallet, connection: web3Connection }: WalletAndConnection
) => {
  const tx = await createRevokeConnectionTransaction(wallet, to);
  const signedTX = await wallet.signTransaction(tx);
  return web3Connection.sendTransaction(signedTX, []);
};
