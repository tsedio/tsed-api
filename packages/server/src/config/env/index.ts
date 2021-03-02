export const config = require("dotenv").config({path: process.cwd()});
export const isProduction = process.env.NODE_ENV === "production";
