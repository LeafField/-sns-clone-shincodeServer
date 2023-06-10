import jwt from "jsonwebtoken";
import { Router } from "express";

const router = Router();

router.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(404).json({ message: "権限がありません" });
  }

  jwt.verify(token, process.env.SECRET_KEY!, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(404).json({ message: "権限がありません" });
    }
    if (decoded instanceof Object) {
      req.body.userId = decoded.id;
      next();
    }
  });
});

export default router;
