import { CliUx } from "@oclif/core";
import { getWalletFromKeyPairFile } from "../helpers/wallet";
import GraphProgramCommand from "../base-commands/graph-program-command";
import { web3 } from "@project-serum/anchor";

export default class MakeConnection extends GraphProgramCommand {
  static description = "Makes a connection.";
  static examples = ["<%= config.bin %> <%= command.id %>"];
  static flags = {
    ...GraphProgramCommand.flags,
  };
  static args = [{ name: "to" }];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(MakeConnection);
    CliUx.ux.action.start("Reading dependencies");
    const [wallet, graphProgram] = await Promise.all([
      getWalletFromKeyPairFile(flags.keypair),
      this.getGraphProgram(),
    ]);
    CliUx.ux.action.stop();
    CliUx.ux.action.start("Submitting transaction");
    const toPubkey = new web3.PublicKey(args.to);
    const txId = await graphProgram.methods
      .makeConnection(toPubkey)
      .accounts({ from: wallet.publicKey })
      .rpc();
    CliUx.ux.action.stop();
    this.log(`Transaction ID: ${txId}`);
  }
}
