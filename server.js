const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Comment = require("./models/Comment");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Express-Mongoose API!");
});

// Get all comments
app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ timestamp: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new comment
app.post("/comments", async (req, res) => {
  try {
    const { firstName, lastName, email, comment } = req.body;

    if (!email || !comment) {
      return res
        .status(400)
        .json({ error: "Username and comment are required" });
    }

    const newComment = new Comment({ firstName, lastName, email, comment });
    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
