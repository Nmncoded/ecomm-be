import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query"],
});

const rolesData = [{ name: "ADMIN" }, { name: "USER" }];

async function main() {
  try {

    // console.log("Start seeding categories...");

    for (const role of rolesData) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: {
          name: role.name,
        }
      });
    }

    // console.log("Seeding categories completed.");
  } catch (error) {
    console.error("Error during migration or seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default prisma;