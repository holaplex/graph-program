import { Flags } from "@oclif/core";
import fs from "fs/promises";
import * as anchor from "@project-serum/anchor";
import { Helpers } from "@holaplex/graph-program";
import { chunk } from "lodash";

import GraphProgramCommand from "../base-commands/graph-program-command";
import { getWalletFromKeyPairFile } from "../lib/helpers/wallet";
import { db } from "../lib/database/db";
import { logger } from "../lib/logging/winston";
import { PublicKey } from "@solana/web3.js";

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
    resetDatabase: Flags.boolean({
      char: "r",
      description: "Reset Database",
      default: false,
    }),
  };

  static args = [{ name: "file" }];

  public async run(): Promise<void> {
    const { flags } = await this.parse(AdminMakeConnections);
    let [wallet, graphProgram, connectionsToMake] = await Promise.all([
      getWalletFromKeyPairFile(flags.keypair),
      this.getGraphProgram(),
      fs
        .readFile(flags.connectionsFile, "utf-8")
        .then((data) => JSON.parse(data) as ConnectionFileItem[]),
      db.read(),
    ]);

    db.data ||= { connections: [] };
    if (flags.resetDatabase) {
      db.data.connections = [];
      await db.write();
    }

    if (db.data.connections.length) {
      logger.info(`${db.data.connections.length} connections in database.`);
      connectionsToMake = connectionsToMake.filter(
        (connectionToMake) =>
          !db.data!.connections.find(
            (connection) =>
              connection.from === connectionToMake.from &&
              connection.to === connectionToMake.to &&
              connection.status !== "confirmed"
          )
      );
      logger.info(
        `${db.data.connections.length} connections in database after filtering by confirmed items.`
      );
    } else {
      logger.info(
        "No connections found in database. Loading connections into database."
      );
      db.data.connections = connectionsToMake.map(({ from, to, address }) => ({
        from,
        to,
        v1Address: address,
        status: "pending",
        batch: null,
        txId: null,
      }));
      await db.write();
    }

    const connectionChunks = chunk(connectionsToMake, 10);

    const instructionBatches = await Promise.all(
      connectionChunks.map((batch) =>
        Promise.all(
          batch.map(
            async (
              connectionItem,
              _,
              __,
              fromPK = new PublicKey(connectionItem.from),
              toPK = new PublicKey(connectionItem.to)
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

    for (const [i, currentBatch] of instructionBatches.entries()) {
      const currentChunk = connectionChunks[i];
      try {
        currentChunk.forEach((i) => {
          logger.info(
            `Sending connection: ${i.from} -> ${i.to} with PDA: ${i.address} on batch ${i}/${instructionBatches.length}`
          );
        });
        const txId = await graphProgram.provider.sendAndConfirm!(
          new anchor.web3.Transaction().add(...currentBatch),
          [],
          { commitment: "finalized" }
        );
        logger.info(
          `Successfully sent batch ${i}/${instructionBatches.length} on Transaction ID: ${txId}`
        );
        db.data.connections.forEach((connection) => {
          if (
            currentChunk.find(
              (connectionItem) =>
                connectionItem.from === connection.from &&
                connectionItem.to === connection.to
            )
          ) {
            connection.status = "confirmed";
            connection.batch = i;
            connection.txId = txId;
          }
        });
        await db.write();
      } catch (error) {
        logger.error(`Error sending batch ${i}/${instructionBatches.length}`);
        logger.error(error);
        db.data.connections.forEach((connection) => {
          if (
            currentChunk.find(
              (connectionItem) =>
                connectionItem.from === connection.from &&
                connectionItem.to === connection.to
            )
          ) {
            connection.status = "failed";
            connection.batch = i;
            connection.txId = null;
          }
        });
        await db.write();
      }
    }

    logger.info(
      `Successfully sent ${
        db.data.connections.map((i) => i.status === "confirmed").length
      } connections.`
    );
    logger.info(
      `Failed ${
        db.data.connections.map((i) => i.status === "failed").length
      } connections.`
    );
  }
}
