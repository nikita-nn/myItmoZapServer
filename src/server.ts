import express from "express";
import helmet from "helmet";
import compression from "compression";
import authRouter from "./routes/authRouter";
import peRouter from "./routes/peRouter";

const myItmoZap = express();

myItmoZap.use(helmet());
myItmoZap.use(compression());
myItmoZap.use(express.json());

myItmoZap.use("/api/v2/auth", authRouter);
myItmoZap.use("/api/v2/pe", peRouter);
myItmoZap.listen(5000);
