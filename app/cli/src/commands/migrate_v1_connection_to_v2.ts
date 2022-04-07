import { CliUx } from "@oclif/core";
import { getWalletFromKeyPairFile } from "../helpers/wallet";
import GraphProgramCommand from "../base-commands/graph-program-command";
import { web3 } from "@project-serum/anchor";

export default class MigrateV1ConnectionToV2 extends GraphProgramCommand {
  static description = "Migrates a V1 Connection to It's V2 successor.";
  static examples = ["<%= config.bin %> <%= command.id %>"];
  static flags = {
    ...GraphProgramCommand.flags,
  };
  static args = [{ name: "to" }];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(MigrateV1ConnectionToV2);
    CliUx.ux.action.start("Reading dependencies");
    const [wallet, graphProgram] = await Promise.all([
      getWalletFromKeyPairFile(flags.keypair),
      this.getGraphProgram(),
    ]);
    CliUx.ux.action.stop();
    CliUx.ux.action.start("Submitting transaction");
    const toPubkey = new web3.PublicKey(args.to);
    // TODO: Do magic here.
    CliUx.ux.action.stop();
  }
}
