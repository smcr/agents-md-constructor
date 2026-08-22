import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { login: "admin" } });
  if (existing) {
    return;
  }
  await prisma.user.create({
    data: {
      login: "admin",
      password_hash: await bcrypt.hash("admin", 10),
      name: "Admin",
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
