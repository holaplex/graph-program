import { CliUx } from "@oclif/core";
import { getWalletFromKeyPairFile } from "../helpers/wallet";
import GraphProgramCommand from "../base-commands/graph-program-command";
import { Helpers } from "@holaplex/graph-program";
import { web3 } from "@project-serum/anchor";
export default class CloseConnection extends GraphProgramCommand {
  static description = "Closes a connection and refunds the rent excemption.";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    ...GraphProgramCommand.flags,
  };

  static args = [{ name: "from" }, { name: "to" }];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(CloseConnection);
    CliUx.ux.action.start("Reading dependencies");
    const [wallet, graphProgram] = await Promise.all([
      getWalletFromKeyPairFile(flags.keypair),
      this.getGraphProgram(),
    ]);
    CliUx.ux.action.stop();
    CliUx.ux.action.start("Submitting transaction");
    const fromPubkey = new web3.PublicKey(args.from);
    const toPubkey = new web3.PublicKey(args.to);
    const [pda, bump] = await Helpers.getConnectionPDA(fromPubkey, toPubkey);
    const txId = await graphProgram.methods
      .closeConnection(bump, toPubkey)
      .accounts({
        connection: pda,
        from: fromPubkey,
        signer: wallet.publicKey, // Different signer
      })
      .signers([wallet.payer])
      .rpc();
    CliUx.ux.action.stop();
    this.log(`Transaction ID: ${txId}`);
  }
}
