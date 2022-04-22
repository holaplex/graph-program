import { CliUx, Command, Flags } from "@oclif/core";
import { Queries, Program } from "@holaplex/graph-program";
import * as anchor from "@project-serum/anchor";

export default class QueryConnectionsTo extends Command {
  static description = "Gets all connections to the given input";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    endpoint: Flags.string({
      char: "e",
      description: "RPC Endpoint",
      required: true,
    }),
    ...CliUx.ux.table.flags(),
  };

  static args = [{ name: "to" }];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(QueryConnectionsTo);

    const program = new anchor.Program(
      Program.IDL,
      Program.PROGRAM_ID,
      new anchor.AnchorProvider(
        new anchor.web3.Connection(flags.endpoint),
        new anchor.Wallet(anchor.web3.Keypair.generate()), // Random wallet, it's unused.
        {}
      )
    );
    const results = await Queries.getProgramAccountsV2To(
      new anchor.web3.PublicKey(args.to),
      program
    );
    CliUx.ux.table(
      results,
      {
        pda: { get: (i: any) => i.publicKey.toBase58() },
        from: { get: (i: any) => i.account.from.toBase58() },
        to: { get: (i: any) => i.account.to.toBase58() },
        connected: { get: (i: any) => i.account.connectedAt },
        disconnected: { get: (i: any) => i.account.disconnectedAt },
      } as any,
      {
        ...flags,
      }
    );
  }
}