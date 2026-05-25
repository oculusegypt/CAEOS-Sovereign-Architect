import { Router, type IRouter } from "express";
import healthRouter from "./health";
import openaiRouter from "./openai";
import wizardRouter from "./wizard";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/openai", openaiRouter);
router.use("/wizard", wizardRouter);

export default router;
