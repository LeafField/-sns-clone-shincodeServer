import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

// 新規ユーザー登録API

type RegisteBody = {
  username: string;
  email: string;
  password: string;
};

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body as RegisteBody;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });
  return res.json({ user });
});

type LoginBody = {
  email: string;
  password: string;
};

// ログイン
router.post("/login", async (req, res) => {
  const { email, password } = req.body as LoginBody;

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

// module.exports = router;
export default router;
