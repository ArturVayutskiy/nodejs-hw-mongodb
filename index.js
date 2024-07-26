import dotenv from "dotenv";
import { initMongoConnection } from "./src/db/initMongoConnection.js";
import { setupServer } from "./src/server.js";

dotenv.config();

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();
