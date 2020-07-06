const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, maxlength: 20, minlength: 3 },
  avatar: String,
  bio: String,
  createdAt: { type: Date, default: Date.now() },
  account: { type: String, required: true },
  likedPosts: [{ postId: { type: String } }],
});

module.exports = mongoose.model("Profile", profileSchema);
