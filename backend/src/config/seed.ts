import bcrypt from "bcrypt";
import { prismaClient } from "../utils/generatedClient";

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prismaClient.user.upsert({
    where: { email: "admin@taskmanager.com" },
    update: {
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
    create: {
      name: "Admin",
      email: "admin@taskmanager.com",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(" Admin user seeded");
}

main()
  .catch(console.error)
  .finally(() => prismaClient.$disconnect());

