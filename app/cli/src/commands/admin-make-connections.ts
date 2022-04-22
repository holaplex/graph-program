import { Flags } from "@oclif/core";
import fs from "fs/promises";
import GraphProgramCommand from "../base-commands/graph-program-command";
import { getWalletFromKeyPairFile } from "../helpers/wallet";

type ConnectionFileItem = {
  address: string;
  to: string;
  from: string;
};

export default class AdminMakeConnections extends GraphProgramCommand {
  static description = "Makes connections as an admin account";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    ...GraphProgramCommand.flags,
    connectionsFile: Flags.string({
      char: "c",
      description: "Connections File",
      required: true,
    }),
  };

  static args = [{ name: "file" }];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(AdminMakeConnections);
    const [wallet, graphProgram, connectionsToMake] = await Promise.all([
      getWalletFromKeyPairFile(flags.keypair),
      this.getGraphProgram(),
      JSON.parse(
        await fs.readFile(flags.connectionsFile, "utf-8")
      ) as ConnectionFileItem[],
    ]);
    // TODO: COMPLETE
  }
}
