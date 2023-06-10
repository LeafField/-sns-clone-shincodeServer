import express from "express";
import cors from "cors";
import postsRoute from "./routers/post";
import authRoute from "./routers/auth";
import usersRoute from "./routers/users";
import dotenv from "dotenv";

const PORT = 5000;

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/users", usersRoute);

app.listen(PORT, () => {
  console.log(`TS版が起動したよ!ポートは${PORT}番だね！`);
});
