const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");

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

router.post("/profile/:userId", async (req, res) => {
  const usernameExists = await Profile.findOne({ username: req.body.username });

  if (usernameExists) {
    return res.status(400).send("Username Taken.");
  }

  const account = req.params.userId;

  const profile = new Profile({
    fullName: req.body.fullName,
    username: req.body.username,
    avatar: req.body.avatar,
    createdAt: Date.now(),
    account: account,
  });

  try {
    const savedProfile = await profile.save();
    await User.findOne({ _id: account }, function (err, foundUser) {
      if (err) {
        return res.status(500).send("An error occured, please try again.");
      } else {
        foundUser.hasProfile = true;
        foundUser.save();
      }
    });

    res.status(200).send({ ...savedProfile._doc });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/:uid", async (req, res) => {
  const user = await User.findOne({ _id: req.params.uid });
  if (!user) {
    return res.status(400).send("No user found.");
  }

  res.status(200).send({ ...user._doc });
});

router.get("/profile/:uid", async (req, res) => {
  const profile = await Profile.findOne({ account: req.params.uid });

  if (!profile) {
    return res.status(400).send("No Profile found");
  }

  res.status(200).send(profile);
});

router.get("/postprofile/:postedBy", async (req, res) => {
  const profile = await Profile.findOne({ account: req.params.postedBy });
  if (!profile) {
    return res.status(400).send("No profile found");
  }

  res.status(200).send(profile._doc);
});

module.exports = router;
