import { Command, Flags } from "@oclif/core";
import { Program } from "@holaplex/graph-program";
import * as anchor from "@project-serum/anchor";
import { getWalletFromKeyPairFile } from "../helpers/wallet";

// Java verbosity memories.
export default abstract class GraphProgramCommand extends Command {
  static flags = {
    keypair: Flags.string({
      char: "k",
      description: "Solana Keypair",
      required: true,
    }),
    endpoint: Flags.string({
      char: "e",
      description: "RPC Endpoint",
      required: true,
    }),
  };
  public getGraphProgram = async (): Promise<ReturnType<typeof Program.getGraphProgram>> => {
    const { flags } = await this.parse(GraphProgramCommand);
    const connection = new anchor.web3.Connection(flags.endpoint, "finalized");
    const wallet = await getWalletFromKeyPairFile(flags.keypair);
    const graphProgram = Program.getGraphProgram(
      new anchor.Provider(connection, wallet, {})
    );
    return graphProgram;
  };
}
