
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function createAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      console.log("Admin already exists ✅");
      return;
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    const admin = await prisma.user.create({
      data: {
        name: "mehedifiz",
        email: "mehedi@fiz.com", 
        password: hashedPassword,
        role: "ADMIN",
        userName: "mehedi",
      },
    });

    console.log("Admin created ✅", admin.name);
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    await prisma.$disconnect();
  }
}

