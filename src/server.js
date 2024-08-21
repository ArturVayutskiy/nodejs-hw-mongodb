import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
// import router from './routers/contacts.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3000;

export const setupServer = () => {
  const app = express();

  app.use(express.json({}));
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(router);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    // eslint-disable-next-line no-undef
    console.log(`Server is running on port ${PORT}`);
  });
};
