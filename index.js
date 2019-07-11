// code away!
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => res.send("<h1>WebApi-III-Challenge: Web20</h1>"));
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);


const port = process.env.PORT || 4000;
app.listen(port, console.log(`Sever running on port ${port}`));





