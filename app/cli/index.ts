import { program } from "commander";
import { buildMakeConnectionCommand } from "./commands/makeConnection.js";
import { buildRevokeConnectionCommand } from "./commands/revokeConnection.js";
import { buildGetAllConnectionsFromCommand } from "./commands/getAllConnectionsFrom.js";
import { buildGetAllConnectionsToCommand } from "./commands/getAllConnectionsTo.js";
import { buildGetAllConnectionsCommand } from "./commands/getAllConnections.js";
import { buildCloseConnectionCommand } from "./commands/closeConnection.js";
import { buildMakeAdminConnectionsCommand } from "./commands/makeAdminConnections.js";

program.version("0.2.2");

program
  .command("make-admin-connections")
  .description("Creates the given connections using an Admin wallet.")
  .requiredOption("-k, --solana-keypair <solanaKeypair>", "Solana Keypair")
  .option("-r, --rpc <rpc>", "RPC to use.", "https://api.devnet.solana.com")
  .requiredOption(
    "-c, --connections-file <connectionsFile>",
    "File with the connections (JSON).",
    "./connections.json"
  )
  .action(buildMakeAdminConnectionsCommand());

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
  .command("close-connection")
  .description(
    "Closes a previously revoked connection. This is a permissionless call."
  )
  .requiredOption("-k, --solana-keypair <solanaKeypair>", "Solana Keypair")
  .option("-r, --rpc <rpc>", "RPC to use.", "https://api.devnet.solana.com")
  .requiredOption("-t, --to-public-key <toPublicKey>", "To Public Key")
  .requiredOption(
    "-f, --from-public-key <fromPublicKey>",
    "From Public Key (Usually the same as wallet)."
  )
  .action(buildCloseConnectionCommand());

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

program
  .command("get-all-connections")
  .description("Lists all program connections.")
  .requiredOption("-k, --solana-keypair <solanaKeypair>", "Solana Keypair")
  .option("-r, --rpc <rpc>", "RPC to use.", "https://api.devnet.solana.com")
  .option(
    "-o, --outFile <outFile>",
    "Output file to write.",
    "./connections.json"
  )
  .action(buildGetAllConnectionsCommand());

program.parse(process.argv);
