import * as anchor from "@project-serum/anchor";

import { IDL } from "../../target/types/graph_program";

export const GraphProgram = new anchor.Program(
  IDL,
  "grphSXQnjAoPXSG5p1aJ7ZFw2A1akqP3pkXvjfbSJef"
);
