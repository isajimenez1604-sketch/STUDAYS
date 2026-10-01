import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import v1Routes from "./routes/v1";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", v1Routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`API STUDAYS escuchando en http://localhost:${env.port}`);
});
