import * as anchor from "@project-serum/anchor";

import { GraphProgram, IDL } from "../../target/types/graph_program";

export const PROGRAM_ID = "grphAFGNvCjLKHeEmPNa91eGJChcUhrdaYYharcZCTQ";
export { IDL, GraphProgram } from "../../target/types/graph_program";

export const getGraphProgram = (provider: anchor.AnchorProvider): anchor.Program<GraphProgram> =>
  new anchor.Program(IDL, PROGRAM_ID, provider);
