import { env } from "./config/env";
import { app } from "./server";

app.listen(env.port, "0.0.0.0", () => {
  console.log(`API STUDAYS escuchando en el puerto ${env.port}`);
});
