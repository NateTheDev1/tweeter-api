const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  image: { type: String },
  postedBy: { type: String, required: true },
  likedBy: [{ userId: { type: String, required: true } }],
});

module.exports = new mongoose.model("Post", postSchema);