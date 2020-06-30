const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).send("Email already in use.");
  }

  const salt = await bcrypt.genSalt(10);

  const hashedPass = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
  });
  try {
    const savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_KEY);
    res.status(200).send({ ...savedUser._doc, token: token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  // Check email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Email or password is incorrect.");
  }

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("Email or password is incorrect.");
  }

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_KEY);
  res.header("Authorization", token).send({ ...user._doc, token });
});

module.exports = router;
