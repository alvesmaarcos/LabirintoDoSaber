import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { router } from "./application/routes";
import swaggerDocument from "./swagger.json";

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express from GC!" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`API docs available at http://localhost:${port}/api-docs`);
});

module.exports = app;
