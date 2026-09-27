import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './config/prisma.js';
const server = app.listen(env.PORT, () => console.log(`Link Analytics running at ${env.APP_URL}`));
const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
