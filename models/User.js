const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, maxlength: 35 },
  password: { type: String, required: true, minlength: 6 },
  hasProfile: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
