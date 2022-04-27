import { web3 } from "@project-serum/anchor";
import { b } from "./string";
import { PROGRAM_ID } from "../../program";

export const getConnectionPDA = (from: web3.PublicKey, to: web3.PublicKey) =>
  web3.PublicKey.findProgramAddress(
    [b`connectionv2`, from.toBytes(), to.toBytes()],
    new web3.PublicKey(PROGRAM_ID)
  );
