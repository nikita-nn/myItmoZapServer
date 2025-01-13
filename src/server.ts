import express from "express";
import helmet from "helmet";
import compression from "compression";
import authRouter from "./routes/authRouter";
import {signToLesson} from "./service/PE/PEService";

const myItmoZap = express();

myItmoZap.use(helmet());
myItmoZap.use(compression());
myItmoZap.use(express.json());

myItmoZap.use("/api/v2/auth", authRouter);

myItmoZap.listen(5000,async () =>{
    await  signToLesson(76368, "22222")
});
