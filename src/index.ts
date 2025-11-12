import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { router } from "./application/routes";

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Vercel!" });
});

const swaggerDocument = require(path.resolve(__dirname, "swagger.json"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Documentação Swagger em: http://localhost:${port}/api-docs`);
});

module.exports = app;
