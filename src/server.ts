import cors from "cors";
import express from "express";

import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.middleware";
import v1Routes from "./routes/v1";

// Aquí solo se construye la app; quien la enciende es main.ts
export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", v1Routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
