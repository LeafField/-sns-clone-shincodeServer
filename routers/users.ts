// const router = require("express").Router();
// const { PrismaClient } = require("@prisma/client");
// const isAuthentication = require("../middlewares/isAuthenticated");
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import isAuthentication from "../middlewares/isAuthenticated";

const router = Router();
const prisma = new PrismaClient();

router.get("/find", isAuthentication, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.body.userId },
    });
    if (!user) {
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }
    res.status(200).json({
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: Number(userId) },
      include: {
        user: true,
      },
    });
    if (!profile) {
      return res
        .status(404)
        .json({ message: "プロフィールが見つかりませんでした" });
    }
    return res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// module.exports = router;
export default router;
