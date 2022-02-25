import dotenv from "dotenv";
export const config = dotenv.config();
export const isProduction = process.env.NODE_ENV === "production";
