import { PrismaClient } from "../config/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
console.log("DATABASE_URL:", process.env.DATABASE_URL); // temporary debug
const adapter = new PrismaPg({
    connectionString:`${process.env.DATABASE_URL}`!
})
export const prismaClient = new PrismaClient({adapter})