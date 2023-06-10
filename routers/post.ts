// const router = require("express").Router();
// const { PrismaClient } = require("@prisma/client");
// const isAuthenticated = require("../middlewares/isAuthenticated");

import express from "express";
import { PrismaClient } from "@prisma/client";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

const prisma = new PrismaClient();

// つぶやき投稿用

router.post("/post", isAuthenticated, async (req, res) => {
  const { content, userId } = req.body;

  if (!content) {
    return res.status(400).json({ message: "投稿内容がありません" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: userId,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "サーバーエラーです" });
  }
});

// 最新記事取得用
router.get("/get_latest_post", async (req, res) => {
  try {
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.json(latestPosts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userPost = await prisma.post.findMany({
      where: { authorId: Number(userId) },
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });
    return res.status(200).json(userPost);
  } catch (err) {
    console.log(err);
  }
});

// module.exports = router;
export default router;
