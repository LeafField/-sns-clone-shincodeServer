import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

// つぶやき投稿用
type RegisteBody = {
  content: string;
};

router.post("/post", async (req, res) => {
  console.log("接続されたよ！");
  const { content } = req.body as RegisteBody;

  if (!content) {
    return res.status(400).json({ message: "投稿内容がありません" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: 1,
      },
    });
    return res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラーです" });
  }
});

type LoginBody = {
  email: string;
  password: string;
};

// 最新記事取得用
router.get("/get_latest_post", async (req, res) => {
  try {
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
    });
    return res.json(latestPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

// module.exports = router;
export default router;
