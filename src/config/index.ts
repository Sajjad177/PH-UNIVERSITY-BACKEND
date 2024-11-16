import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  Mongodb_url: process.env.MONGODB_DATABASE_URI,
};
