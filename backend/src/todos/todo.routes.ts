import { Router } from "express";
import {
  getTodosHandler,
  createTodoHandler,
  toggleTodoHandler,
  deleteTodoHandler,
} from "./todo.controller";

const router = Router();

router.get("/", getTodosHandler);
router.post("/", createTodoHandler);
router.patch("/:id", toggleTodoHandler);
router.delete("/:id", deleteTodoHandler);

export default router;
