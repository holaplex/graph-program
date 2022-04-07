import { CliUx, Command, Flags } from "@oclif/core";
import { Queries, Program } from "@holaplex/graph-program";
import * as anchor from "@project-serum/anchor";

export default class QueryConnectionsToV1 extends Command {
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
    const { args, flags } = await this.parse(QueryConnectionsToV1);

    const program = new anchor.Program(
      Program.IDL,
      Program.PROGRAM_ID,
      new anchor.Provider(
        new anchor.web3.Connection(flags.endpoint),
        new anchor.Wallet(anchor.web3.Keypair.generate()), // Random wallet, it's unused.
        {}
      )
    );
    const results = await Queries.getProgramAccountsTo(
      new anchor.web3.PublicKey(args.to),
      program
    );
    CliUx.ux.table(
      results,
      {
        pda: { get: (i: any) => i.publicKey.toBase58() },
        from: { get: (i: any) => i.account.from.toBase58() },
        to: { get: (i: any) => i.account.to.toBase58() },
      } as any,
      {
        ...flags,
      }
    );
  }
}
