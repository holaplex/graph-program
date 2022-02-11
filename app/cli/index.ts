import { program } from "commander";
import { buildMakeConnectionCommand } from "./commands/makeConnection.js";
import { buildRevokeConnectionCommand } from "./commands/revokeConnection.js";

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
