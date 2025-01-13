import express from "express";
import helmet from "helmet";
import compression from "compression";
import authRouter from "./routes/authRouter";

const myItmoZap = express();

myItmoZap.use(helmet());
myItmoZap.use(compression());
myItmoZap.use(express.json());

myItmoZap.use("/api/v2/auth", authRouter);

myItmoZap.listen(5000);
