const express = require("express");
const dotenv = require("dotenv");
const authRoute = require("./routers/auth");
const postsRoute = require("./routers/post");
const usersRoute = require("./routers/users");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/users", usersRoute);

app.listen(PORT, () => {
  console.log(`サーバーが動いたよ！PORTは${PORT}番だね！`);
});
