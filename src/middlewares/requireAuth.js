// Import mongoose to connect to mongodb
const mongoose = require("mongoose");

// Import jsonwebtoken library
const jwt = require("jsonwebtoken");

// Import user model
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  // Function to request a token from the client
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in." });
  }

  // Replace the authorization header, with only the token
  const token = authorization.replace("Bearer ", "");

  // Method to verify the token, and giver error if invalid or go to the next middleware
  jwt.verify(token, "MY_SECRET_KEY", async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in." });
    }

    const { userId } = payload;

    const user = await User.findById(userId);
    req.user = user;
    next();
  });
};
