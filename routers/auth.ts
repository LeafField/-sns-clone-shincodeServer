import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import generateIdenticon from "../utils/jenerateIdenticon";
const router = express.Router();
const prisma = new PrismaClient();

// 新規ユーザー登録API

type ReqBody = {
  username: string;
  email: string;
  password: string;
};

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body as ReqBody;

  const defaultIconImage = generateIdenticon(email);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      profile: {
        create: {
          bio: "始めまして",
          profileImageUrl: defaultIconImage,
        },
      },
    },
    include: {
      profile: true,
    },
  });
  return res.json({ user });
});

// ログイン
router.post("/login", async (req, res) => {
  const { email, password } = req.body as Omit<ReqBody, "username">;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({
      error: "そのユーザーは存在しません",
    });
  }

  const isPasswordvaild = await bcrypt.compare(password, user.password);

  if (!isPasswordvaild) {
    return res.status(401).json({
      error: "パスワードが間違っています",
    });
  }

  const token = jwt.sign({ id: user.id }, String(process.env.SECRET_KEY), {
    expiresIn: "1d",
  });

  return res.json({ token });
});

export default router;
