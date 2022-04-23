import { CliUx } from "@oclif/core";
import { getWalletFromKeyPairFile } from "../lib/helpers/wallet";
import { web3 } from "@project-serum/anchor";
import GraphProgramCommand from "../base-commands/graph-program-command";
import { Helpers } from "@holaplex/graph-program";

export default class RevokeConnection extends GraphProgramCommand {
  static description = "Revokes a connection and marks it available to close.";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    ...GraphProgramCommand.flags,
  };

  static args = [{ name: "to" }];

  public async run(): Promise<void> {
    const { args } = await this.parse(RevokeConnection);
    CliUx.ux.action.start("Reading dependencies");
    const graphProgram = await this.getGraphProgram();
    CliUx.ux.action.stop();
    CliUx.ux.action.start("Submitting transaction");
    const fromPubkey = new web3.PublicKey(args.from);
    const toPubkey = new web3.PublicKey(args.to);
    const [, bump] = await Helpers.getConnectionPDA(fromPubkey, toPubkey);
    const txId = await graphProgram.methods
      .revokeConnection(bump, toPubkey)
      .accounts({ from: fromPubkey })
      .rpc();
    CliUx.ux.action.stop();
    this.log(`Transaction ID: ${txId}`);
  }
}
