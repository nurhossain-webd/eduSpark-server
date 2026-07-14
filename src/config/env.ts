import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,

  mongodbUri: process.env.MONGODB_URI as string,

  jwtSecret: process.env.JWT_SECRET as string,
};