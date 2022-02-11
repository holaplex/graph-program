import { Wallet, web3 } from "@project-serum/anchor";
import { b } from "./lib/helpers/string";
import { GraphProgram } from "./program";

export const getConnectionPDA = (wallet: Wallet, to: web3.PublicKey) =>
  web3.PublicKey.findProgramAddress(
    [b`connection`, wallet.publicKey.toBytes(), to.toBytes()],
    GraphProgram.programId
  );

export const createMakeConnectionTransaction = async (
  wallet: Wallet,
  to: web3.PublicKey
) => {
  const [connection] = await web3.PublicKey.findProgramAddress(
    [b`connection`, wallet.publicKey.toBytes(), to.toBytes()],
    GraphProgram.programId
  );
  return GraphProgram.transaction.makeConnection(to, {
    accounts: {
      connection,
      from: wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    },
  });
};

export const createRevokeConnectionTransaction = async (
  wallet: Wallet,
  to: web3.PublicKey
) => {
  const [connection, bump] = await getConnectionPDA(wallet, to);
  return GraphProgram.transaction.revokeConnection(bump, to, {
    accounts: {
      from: wallet.publicKey,
      connection,
    },
  });
};
