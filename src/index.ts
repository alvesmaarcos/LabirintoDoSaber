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
  res.json({ message: "Hello from Express on Vercel!" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
