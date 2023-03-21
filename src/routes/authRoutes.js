// Import express to function as API
const express = require("express");

// Import mongoose to connect to mongodb
const mongoose = require("mongoose");

// Import jsonwebtoken library
const jwt = require("jsonwebtoken");

// Import user model
const User = mongoose.model("User");

// Use express router method
const router = express.Router();

// POST method for creating a new user
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();

    // Create a token
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");

    res.send({ token });
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

// POST method for logging in a user
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

module.exports = router;
