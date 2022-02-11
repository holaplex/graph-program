import { ACCOUNT_DISCRIMINATOR_SIZE, web3 } from "@project-serum/anchor";
import { GraphProgram } from "./program";

export const getAllConnectionsFrom = (from: web3.PublicKey) =>
  GraphProgram.account.connection.all([
    {
      memcmp: {
        offset: ACCOUNT_DISCRIMINATOR_SIZE,
        bytes: from.toBase58(),
      },
    },
  ]);

export const getAllConnectionsTo = (to: web3.PublicKey) =>
  GraphProgram.account.connection.all([
    {
      memcmp: {
        offset: ACCOUNT_DISCRIMINATOR_SIZE + 32,
        bytes: to.toBase58(),
      },
    },
  ]);

// TODO: Add Twitter-Verified accounts using the Solana Name Service Program.
