import express from "express";
import dotenv from "dotenv";
import authRoute from "./routers/auth";
import postsRoute from "./routers/post";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

app.listen(PORT, () => {
  console.log(`サーバーが動いたよ！PORTは${PORT}番だね！`);
});

app.get("/", () => `<h1>aaaaa</h1>`);
