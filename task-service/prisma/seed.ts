import {
  PrismaClient,
  Priority,
  Status,
  Prisma,
} from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting the database seeding process...");

  // Optional: Clear existing tasks so you don't get duplicates if you run this twice
  await prisma.task.deleteMany();
  console.log("🧹 Cleared old tasks.");

  // Arrays to randomly pick from
  const priorities = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];
  const statuses = [Status.TODO, Status.DONE];

  const tasksToCreate: Prisma.TaskCreateManyInput[] = [];

  // Generate 25 fake tasks
  for (let i = 1; i <= 25; i++) {
    tasksToCreate.push({
      title: `Assessment Task ${i}: Review module requirements`,
      priority: priorities[Math.floor(Math.random() * priorities.length)]!,
      status: statuses[Math.floor(Math.random() * statuses.length)]!,
      // We don't need to pass 'id' or 'createdAt' because Prisma/SQL generate those automatically!
    });
  }

  // Insert them all into the database at once!
  const created = await prisma.task.createMany({
    data: tasksToCreate,
  });

  console.log(`✅ Successfully seeded ${created.count} tasks into the database!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
