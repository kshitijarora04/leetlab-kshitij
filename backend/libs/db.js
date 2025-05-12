import { PrismaClient } from "../src/generated/prisma/index.js";
import dotenv from "dotenv";
dotenv.config();

const globalForPrisma = globalThis;
// exporting db using prisma
export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
