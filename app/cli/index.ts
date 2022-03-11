import { program } from "commander";
import { buildMakeConnectionCommand } from "./commands/makeConnection.js";
import { buildRevokeConnectionCommand } from "./commands/revokeConnection.js";
import { buildGetAllConnectionsFromCommand } from "./commands/getAllConnectionsFrom.js";
import { buildGetAllConnectionsToCommand } from "./commands/getAllConnectionsTo.js";

program.version("0.1.0");

program
  .command("make-connection")
  .description("Makes a connection.")
  .requiredOption("-k, --solana-keypair <solanaKeypair>", "Solana Keypair")
  .requiredOption("-p, --public-key <publicKey>", "Public key to connect to")
  .option("-r, --rpc <rpc>", "RPC to use.", "https://api.devnet.solana.com")
  .action(buildMakeConnectionCommand());

program
  .command("revoke-connection")
  .description("Revokes a connection.")
  .requiredOption("-k, --solana-keypair <solanaKeypair>", "Solana Keypair")
  .requiredOption(
    "-p, --public-key <publicKey>",
    "Public key to revoke connection from"
  )
  .option("-r, --rpc <rpc>", "RPC to use.", "https://api.devnet.solana.com")
  .action(buildRevokeConnectionCommand());

program
  .command("get-all-connections-to")
  .description("Lists connections to an account.")
  .requiredOption("-k, --solana-keypair <solanaKeypair>", "Solana Keypair")
  .option("-r, --rpc <rpc>", "RPC to use.", "https://api.devnet.solana.com")
  .action(buildGetAllConnectionsFromCommand());

program
  .command("get-all-connections-from")
  .description("Lists connections from an account.")
  .requiredOption("-k, --solana-keypair <solanaKeypair>", "Solana Keypair")
  .option("-r, --rpc <rpc>", "RPC to use.", "https://api.devnet.solana.com")
  .action(buildGetAllConnectionsToCommand());

program.parse(process.argv);
