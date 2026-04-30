import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { apiRouter } from "./routes/api";
import { swaggerSpec } from "./docs/swagger";


export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", apiRouter);