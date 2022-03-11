import { web3 } from "@project-serum/anchor";
import { WalletAndConnection } from "./actions";
import { b } from "./lib/helpers/string";
import { getGraphProgram } from "./program";

export const getConnectionPDA = (
  from: web3.PublicKey,
  to: web3.PublicKey,
  programId: web3.PublicKey
) => {
  return web3.PublicKey.findProgramAddress(
    [b`connection`, from.toBytes(), to.toBytes()],
    programId
  );
};

export const createMakeConnectionTransaction = async (
  to: web3.PublicKey,
  walletAndConnection: WalletAndConnection
) => {
  const program = getGraphProgram(walletAndConnection);
  const [connection] = await getConnectionPDA(
    walletAndConnection.wallet.publicKey,
    to,
    program.programId
  );
  return program.transaction.makeConnection(to, {
    accounts: {
      connection,
      from: walletAndConnection.wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
    },
  });
};

export const createRevokeConnectionTransaction = async (
  to: web3.PublicKey,
  walletAndConnection: WalletAndConnection
) => {
  const program = getGraphProgram(walletAndConnection);
  const [connection, bump] = await getConnectionPDA(
    walletAndConnection.wallet.publicKey,
    to,
    program.programId
  );
  return program.transaction.revokeConnection(bump, to, {
    accounts: {
      from: walletAndConnection.wallet.publicKey,
      connection,
    },
  });
};
