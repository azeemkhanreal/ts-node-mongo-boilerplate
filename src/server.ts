import 'reflect-metadata';
import logger from "./loader/logger";
import config from 'config';
import App from "./app";

const port = config.get<number>('port');


const app = App();

const server = app.listen(port, () => {
  logger.info(`App is running at http://localhost:${port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
