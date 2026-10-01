import { env } from "./config/env";
import { app } from "./server";

app.listen(env.port, () => {
  console.log(`API STUDAYS escuchando en http://localhost:${env.port}`);
});
