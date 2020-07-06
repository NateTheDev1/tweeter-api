const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  image: { type: String },
  postedBy: { type: String, required: true },
  likedBy: [{ userId: { type: String } }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = new mongoose.model("Post", postSchema);
