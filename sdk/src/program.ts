import * as anchor from "@project-serum/anchor";

import { GraphProgram, IDL } from "../../target/types/graph_program";

export const PROGRAM_ID = "grphSXQnjAoPXSG5p1aJ7ZFw2A1akqP3pkXvjfbSJef";
export { IDL, GraphProgram } from "../../target/types/graph_program";

export const getGraphProgram = (provider: anchor.Provider): anchor.Program<GraphProgram> =>
  new anchor.Program(IDL, PROGRAM_ID, provider);
