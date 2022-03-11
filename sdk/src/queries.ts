import { ACCOUNT_DISCRIMINATOR_SIZE, web3 } from "@project-serum/anchor";
import { WalletAndConnection } from "./actions";
import { getGraphProgram } from "./program";

export const getAllConnectionsFrom = (
  from: web3.PublicKey,
  walletAndConnection: WalletAndConnection
) => {
  const offset = ACCOUNT_DISCRIMINATOR_SIZE;
  return getGraphProgram(walletAndConnection).account.connection.all([
    {
      memcmp: {
        offset,
        bytes: from.toBase58(),
      },
    },
  ]);
};

export const getAllConnectionsTo = (
  to: web3.PublicKey,
  walletAndConnection: WalletAndConnection
) => {
  const offset = ACCOUNT_DISCRIMINATOR_SIZE + 32;
  return getGraphProgram(walletAndConnection).account.connection.all([
    {
      memcmp: {
        offset,
        bytes: to.toBase58(),
      },
    },
  ]);
};

// TODO: Add Twitter-Verified accounts using the Solana Name Service Program.
