// Import express to function as API
const express = require("express");

// Import mongoose to connect to mongodb
const mongoose = require("mongoose");

// Import authentication middleware
const requireAuth = require("../middlewares/requireAuth");

// Import track model
const Track = mongoose.model("Track");

// Use express router method
const router = express.Router();

// Require user to be logged in
router.use(requireAuth);

// Get all tracks
router.get("/tracks", async (req, res) => {
  const tracks = await Track.find({ userId: req.user._id });

  res.send(tracks);
});

// Create a new track
router.post("/tracks", async (req, res) => {
  const { name, locations } = req.body;

  if (!name || !locations) {
    return res
      .status(422)
      .send({ error: "You must provide a name and locations" });
  }

  try {
    const track = new Track({ name, locations, userId: req.user._id });
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
