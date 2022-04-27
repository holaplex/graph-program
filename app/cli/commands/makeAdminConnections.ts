import * as anchor from "@project-serum/anchor";
import { Helpers, Program } from "@holaplex/graph-program";
import fs from "fs/promises";
import { getWallet } from "../tools/wallet.js";
import { logger } from "../tools/logging/winston.js";
import _ from "lodash";

const { getGraphProgram } = Program;

type MakeAdminConnectionsCommandInput = {
  rpc: string;
  solanaKeypair: string;
  connectionsFile: string;
};

export const buildMakeAdminConnectionsCommand =
  () => async (input: MakeAdminConnectionsCommandInput) => {
    logger.info("Loading dependencies...");
    const wallet = await getWallet(input.solanaKeypair);
    const connection = new anchor.web3.Connection(input.rpc);
    const graphProgram = getGraphProgram(
      new anchor.AnchorProvider(connection, wallet, {})
    );
    const connectionsFile = await fs.readFile(input.connectionsFile, "utf-8");
    let connectionsToMake = JSON.parse(connectionsFile) as {
      address: string;
      to: string;
      from: string;
    }[];

    // This loop ideally should be it's own anonymous filter function
    // But asynchrounous code makes this a bit harder to achieve
    // It pretty much removes all existing connections from the
    // Memory items to add.
    logger.info("Removing existing connections...");
    for (const connection of connectionsToMake) {
      const [pda] = await Helpers.getConnectionPDA(
        new anchor.web3.PublicKey(connection.from),
        new anchor.web3.PublicKey(connection.to)
      );
      const exists = !!(await graphProgram.account.connectionV2.fetchNullable(
        pda
      ));
      if (exists) {
        logger.info(
          `This account already exists on v2: ${pda.toBase58()} for the connection: ${
            connection.from
          } -> ${connection.to}. Skipping`
        );
        connectionsToMake = connectionsToMake.filter(
          (i) => i.address !== connection.address
        );
      }
    }

    logger.info(`Got: ${connectionsToMake.length} items to make`);

    const connectionChunks = _.chunk(connectionsToMake, 8); // Batches of 8 instructions to avoid popping the TX size limit.

    const instructionBatches = await Promise.all(
      connectionChunks.map((batch) =>
        Promise.all(
          batch.map(
            async (
              connectionItem,
              _,
              __,
              fromPK = new anchor.web3.PublicKey(connectionItem.from),
              toPK = new anchor.web3.PublicKey(connectionItem.to)
            ) =>
              graphProgram.methods
                .adminMakeConnection(fromPK, toPK)
                .accounts({
                  connection: (await Helpers.getConnectionPDA(fromPK, toPK))[0],
                  signer: wallet.publicKey,
                  systemProgram: anchor.web3.SystemProgram.programId,
                })
                .instruction()
          )
        )
      )
    );

    for (const [
      instructionBatchIndex,
      currentInstructionBatch,
    ] of instructionBatches.entries()) {
      const currentChunk = connectionChunks[instructionBatchIndex];
      try {
        currentChunk.forEach((chunkItem) => {
          logger.info(
            `Sending connection: ${chunkItem.from} -> ${
              chunkItem.to
            } with PDA: ${chunkItem.address} on batch ${
              instructionBatchIndex + 1
            }/${instructionBatches.length}`
          );
        });
        const txId = await graphProgram.provider.sendAndConfirm!(
          new anchor.web3.Transaction().add(...currentInstructionBatch),
          [],
          { commitment: "processed" }
        );
        logger.info(
          `Successfully sent batch ${instructionBatchIndex + 1}/${
            instructionBatches.length
          } on Transaction ID: ${txId}`
        );
      } catch (error: any) {
        console.error({ error });
        logger.error(error?.message);
        logger.error(
          `Error sending batch ${instructionBatchIndex + 1}/${
            instructionBatches.length
          }`
        );
        currentChunk.forEach((chunkItem) => {
          logger.error(
            `Error sending connection: ${chunkItem.from} -> ${
              chunkItem.to
            } with PDA: ${chunkItem.address} on batch ${
              instructionBatchIndex + 1
            }/${instructionBatches.length}`
          );
        });
        logger.error(error);
      }
    }
    logger.info("Done!");
  };
