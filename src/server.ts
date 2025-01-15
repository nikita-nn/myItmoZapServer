import express from "express";
import helmet from "helmet";
import compression from "compression";
import authRouter from "./routes/authRouter";
import peRouter from "./routes/peRouter";
import nodesRouter from "./routes/nodesRouter";
import {
  checkNodePing,
  healthCheck,
  restartActiveTasks,
} from "./service/system/healthCheck";
import cron from "node-cron";

const myItmoZap = express();

myItmoZap.use(helmet());
myItmoZap.use(compression());
myItmoZap.use(express.json());

myItmoZap.use("/api/v2/auth", authRouter);
myItmoZap.use("/api/v2/pe", peRouter);
myItmoZap.use("/api/v2/nodes", nodesRouter);

myItmoZap.listen(5000, async () => {
  await healthCheck();
  await restartActiveTasks();
});

cron.schedule("*/1 * * * *", async () => {
  await checkNodePing();
});
