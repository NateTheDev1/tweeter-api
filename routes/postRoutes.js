const router = require("express").Router();
const Post = require("../models/Post");
const Profile = require("../models/Profile");

router.get("/all", async (req, res) => {
  const allPosts = await Post.find();
  const sorted = await allPosts
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt);
  res.status(200).send(sorted);
});

router.post("/new/:userId", async (req, res) => {
  const newPost = new Post({
    content: req.body.content,
    image: req.body.image,
    postedBy: req.params.userId,
  });

  try {
    const savedPost = await newPost.save();
    res.status(200).send(savedPost._doc);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/like/:postId", async (req, res) => {
  await Post.findOne({ _id: req.params.postId }, function (err, foundPost) {
    if (err) {
      return res.status(500).send("No post found");
    } else {
      foundPost.likedBy.push(req.body.userId);
      foundPost.save();
    }
  });

  await Profile.findOne({ account: req.body.userId }, function (
    err,
    foundProfile
  ) {
    if (err) {
      return res.status(500).send("No Profile Found");
    } else {
      foundProfile.likedPosts.push(req.params.postId);
      foundProfile.save();
    }
  });

  return res.status(200).send("Success");
});

router.post("/unlike/:postId", async (req, res) => {
  await Post.findOne({ _id: req.params.postId }, function (err, foundPost) {
    if (err) {
      return res.status(500).send("No post found");
    } else {
      const newPost = foundPost.likedBy.filter((liked) => {
        console.log(liked._id, req.body.userId);
        return liked._id != req.body.userId;
      });
      console.log(newPost);
      foundPost.likedBy = newPost;
      foundPost.save();
    }
  });

  await Profile.findOne({ account: req.body.userId }, function (
    err,
    foundProfile
  ) {
    if (err) {
      return res.status(500).send("No Profile Found");
    } else {
      const newProfile = foundProfile.likedPosts.filter((like) => {
        return like._id !== req.params.postId;
      });
      foundProfile.likedPosts = newProfile;
      foundProfile.save();
    }
  });
  return res.status(200).json("Success");
});

module.exports = router;
