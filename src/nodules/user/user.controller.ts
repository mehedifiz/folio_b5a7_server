import { Request, Response } from "express";
import { Prisma } from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = await Prisma.user.findFirst({
    where: { name: username },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },
     JWT_SECRET
  );

  return res.status(200).json({
    message: "Login successful ",
    token,
    user: {
      id: user.id,
      username: user.userName,
      name: user.name,
      role: user.role,
    },
  });
};
