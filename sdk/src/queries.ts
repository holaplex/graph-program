import { ACCOUNT_DISCRIMINATOR_SIZE, web3 } from "@project-serum/anchor";
import { WalletAndConnection } from "./actions";
import { getGraphProgram } from "./program";

export const getAllConnectionsFrom = (
  from: web3.PublicKey,
  walletAndConnection: WalletAndConnection
) =>
  getGraphProgram(walletAndConnection).account.connection.all([
    {
      memcmp: {
        offset: ACCOUNT_DISCRIMINATOR_SIZE + 32,
        bytes: from.toBase58(),
      },
    },
  ]);

export const getAllConnectionsTo = (
  to: web3.PublicKey,
  walletAndConnection: WalletAndConnection
) =>
  getGraphProgram(walletAndConnection).account.connection.all([
    {
      memcmp: {
        offset: ACCOUNT_DISCRIMINATOR_SIZE,
        bytes: to.toBase58(),
      },
    },
  ]);

// TODO: Add Twitter-Verified accounts using the Solana Name Service Program.
