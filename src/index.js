// For execution off user and track file, at least one time.
require("./models/User");
require("./models/Track");

// Import express to function as API
const express = require("express");

// Import mongoose to connect to mongodb
const mongoose = require("mongoose");

// Use body parser so we can get info from body in HTTP requests
const bodyParser = require("body-parser");

// Import routes
const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");

// Import authentication middleware
const requireAuth = require("./middlewares/requireAuth");

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

// Connect to MongoDB
const mongoUri =
  "mongodb+srv://bast38900:LflZrJ4aUcbMwBzR@cluster0.0tbtyif.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoUri, {});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB", err);
});

app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
