import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.timestamp() }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
