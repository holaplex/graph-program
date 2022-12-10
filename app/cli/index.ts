import { program } from "commander";

program.version("0.4.0");

program
  .command("create-connections_storage")
  .description("Creates connections storage.")
  .requiredOption("-k, --solana-keypair <solanaKeypair>", "Solana Keypair")
  .requiredOption("-p, --public-key <publicKey>", "Public key to connect to")
  .option("-r, --rpc <rpc>", "RPC to use.", "https://api.devnet.solana.com")
  .action(async () => {});

program.parse(process.argv);
