import { CliUx } from "@oclif/core";
import { getWalletFromKeyPairFile } from "../helpers/wallet";
import { b } from "../helpers/string";
import GraphProgramCommand from "../base-commands/graph-program-command";
import { web3 } from "@project-serum/anchor";

export default class MigrateV1ConnectionToV2 extends GraphProgramCommand {
  static description = "Migrates a V1 Connection to It's V2 successor.";
  static examples = ["<%= config.bin %> <%= command.id %>"];
  static flags = {
    ...GraphProgramCommand.flags,
  };
  static args = [];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(MigrateV1ConnectionToV2);
    CliUx.ux.action.start("Reading dependencies");
    const [wallet, graphProgram] = await Promise.all([
      getWalletFromKeyPairFile(flags.keypair),
      this.getGraphProgram(),
    ]);
    CliUx.ux.action.stop();

    CliUx.ux.action.start("Getting v1 connections...");
    const v1Connections = await graphProgram.account.connection.all();
    CliUx.ux.action.stop();

    this.log(`Got ${v1Connections.length} v1 connections`);

    for (const connection of v1Connections) {
      const from = connection.account.from;
      const to = connection.account.to;
      const [v1PubKey, v1AccountBump] = await web3.PublicKey.findProgramAddress(
        [b`connection`, from.toBytes(), to.toBytes()],
        graphProgram.programId
      );
      this.log(`(OLD) Got connection v1 address: ${v1PubKey.toBase58()}`);
      const [v2PubKey] = await web3.PublicKey.findProgramAddress(
        [b`connectionv2`, from.toBytes(), to.toBytes()],
        graphProgram.programId
      );
      this.log(`(NEW) Got connection v2 address: ${v1PubKey.toBase58()}`);
      const txId = await graphProgram.methods
        .migrateV1ToV2Connection(v1AccountBump, to)
        .accounts({
          connection: v1PubKey,
          connectionV2: v2PubKey,
          from,
          signer: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet.payer])
        .rpc();
    }

    CliUx.ux.action.stop();
  }
}
