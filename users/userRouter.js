const express = require("express");
const userDb = require("./userDb");
const postDb = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  try {
    const userId = await userDb.insert(req.body);
    const user = await userDb.findById(userId.id);
    if (user) {
      res.status(201).json(user);
    } else {
      res.status(404).json({
        errorMessage: "There was a problem finding the user we just added"
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage:
        "Something went wrong when adding that entry to the database"
    });
  }
});

router.post("/:id/posts", validatePost, async (req, res) => {
  const id = req.params.id;
  const newPost = { ...req.body, user_id: id };
  try {
    const postId = await postDb.insert(newPost);
    const post = await postDb.findById(newPost.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        errorMessage: "There was a problem finding the user we just added"
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        errorMessage: "Something went wrong adding that post to the database"
      });
  }
});

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

function validatePost(req, res, next) {
  const post = req.body;
  if (!post) {
    res.status(400).json({ message: "missing post data" });
  } else if (!post.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
