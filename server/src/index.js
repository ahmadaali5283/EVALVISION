import { initContainer } from "./infrastructure/di/container.js";
import { env } from "./infrastructure/config/env.js";
import { connectDB } from "./infrastructure/config/db.js";
import dns from 'node:dns/promises';

dns.setServers(['1.1.1.1', '8.8.8.8']);

connectDB().then(() => {
  const app = initContainer();
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
});
