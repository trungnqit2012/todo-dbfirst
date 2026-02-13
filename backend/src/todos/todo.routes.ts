import { Router } from "express";
import { getTodosHandler } from "./todo.controller";

const router = Router();

router.get("/", getTodosHandler);

export default router;
