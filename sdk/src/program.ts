import * as anchor from "@project-serum/anchor";

import { IDL } from "../../target/types/graph_program";
import { WalletAndConnection } from "./actions";

export const PROGRAM_ID = "grphSXQnjAoPXSG5p1aJ7ZFw2A1akqP3pkXvjfbSJef";
export { IDL } from "../../target/types/graph_program";

export const getGraphProgram = ({
  connection,
  wallet,
}: WalletAndConnection) => {
  return new anchor.Program(
    IDL,
    PROGRAM_ID,
    new anchor.Provider(connection, wallet, {})
  );
};
