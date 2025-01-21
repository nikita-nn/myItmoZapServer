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
import keysRouter from "./routes/keysRouter";
import userRouter from "./routes/userRoutes";
import electionRouter from "./routes/electionRouter";
import otherRouter from "./routes/otherRouter";

const myItmoZap = express();

myItmoZap.use(helmet());
myItmoZap.use(compression());
myItmoZap.use(express.json());

myItmoZap.use("/api/v2/auth", authRouter);
myItmoZap.use("/api/v2/pe", peRouter);
myItmoZap.use("/api/v2/nodes", nodesRouter);
myItmoZap.use("/api/v2/keys", keysRouter);
myItmoZap.use("/api/v2/user", userRouter);
myItmoZap.use("/api/v2/election", electionRouter);
myItmoZap.use("/api/v2/other", otherRouter);

myItmoZap.listen(5000, async () => {
  await healthCheck();
  await restartActiveTasks();
});

cron.schedule("*/1 * * * *", async () => {
  await checkNodePing();
});
