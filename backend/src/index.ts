import express from "express";
import cors from "cors";
import todoRoutes from "./todos/todo.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Todo API is running");
});

/* ==============================
   ROUTES
============================== */
app.use("/api/todos", todoRoutes);

/* ==============================
   START SERVER
============================== */
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
