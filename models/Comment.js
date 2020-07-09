const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postedBy: String,
  content: String,
  postId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = new mongoose.model("Comment", commentSchema);
