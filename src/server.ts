import { prisma } from "./lib/prisma";

async function main() {
    try {
        await prisma.$connect()
        console.log("Connected to the database successfully");
    } catch (error) {
        console.log("An error occured", error);
    }

}