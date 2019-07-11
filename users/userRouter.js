const express = require("express");
const userDb = require("./userDb");

const router = express.Router();

router.post("/", (req, res) => {});

router.post("/:id/posts", (req, res) => {});

router.get("/", async (req, res) => {
  try {
    const users = await userDb.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userDb.getById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res
        .status(404)
        .json({ errorMessage: "We could not find a user at that id" });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Something went wrong, we could not get a user at that id"
    });
  }
});

router.get("/:id/posts", async (req, res) => {
  const id = req.params.id;
  try {
    const posts = await userDb.getUserPosts(id);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      errorMessage:
        "Something went wrong, we could not get the posts for that user"
    });
  }
});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

async function validateUserId(req, res, next) {
  const id = req.params.id;
  try {
    const user = await userDb.findById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({
        errorMessage: "We're sorry, we could not find a user at that id"
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: "Something went wrong."
    });
  }
}

function validateUser(req, res, next) {
  const user = req.body;
  if (!user) {
    res.status(400).json({ message: "missing user data" });
  } else if (!user.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {}

module.exports = router;
