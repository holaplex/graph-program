import * as anchor from "@project-serum/anchor";

import { IDL } from "../../target/types/graph_program";
import { WalletAndConnection } from "./actions";

export const getGraphProgram = ({
  connection,
  wallet,
}: WalletAndConnection) => {
  return new anchor.Program(
    IDL,
    "grphSXQnjAoPXSG5p1aJ7ZFw2A1akqP3pkXvjfbSJef",
    new anchor.Provider(connection, wallet, {})
  );
};
