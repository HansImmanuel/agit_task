import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

const taskData: Prisma.TaskCreateInput[] = [
  {
    title: "Buy Noodles",
    description: "Buy Noodles from the market the curly type ones before tomorrow",
    isCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted_at: null,
  },
  {
    title: "Buy Eggs",
    description: "Buy 12 eggs from the market",
    isCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted_at: null,
  },
];

export async function main() {
  for (const task of taskData) {
    await prisma.task.create({ data: task });
  }
}

main();