import app from './app';
import mongoose from 'mongoose';
import config from './config';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.Mongodb_url as string);
    server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

//TODO : handle unhandled promise rejection or error for asyncronous code
process.on('unhandledRejection', () => {
  console.log('unhandledRejection 😑 is surrouned');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  // when server is not running
  process.exit(1);
});

//TODO : handle uncaughtException for syncronous code ->
process.on('uncaughtException', () => {
  console.log('uncaughtException 😑 is surrouned ------ -> ');
  process.exit(1);
});

// checking uncaughtException error ->
// console.log(x);
