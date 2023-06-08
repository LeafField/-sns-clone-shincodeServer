const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthentication = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

router.get("/find", isAuthentication, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }
    res.status(200).json({
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
