import app from './app';
import mongoose from 'mongoose';
import config from './config';
import { Server } from 'http';
import seedSuperAdmin from './DB';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.Mongodb_url as string);
    // add super-Admin :
    seedSuperAdmin();
    server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

//This code is handling two types of errors in a Node.js application: unhandled promise rejections and uncaught exceptions.

//Step 1: Handling Unhandled Promise Rejections ->
process.on('unhandledRejection', () => {
  console.log('unhandledRejection 😑 is surrouned ------ -> ');
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  //process.exit(1);: If the server is not running, it directly exits the process with exit code 1.
  process.exit(1);
});

//Step 2: Handling Uncaught Exceptions ->
process.on('uncaughtException', () => {
  console.log('uncaughtException 😑 is surrouned ------ -> ');
  process.exit(1);
});
