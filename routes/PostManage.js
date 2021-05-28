const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");

const toxicity = require("@tensorflow-models/toxicity");

router.get("/", (req, res, next) => {
  Post.find()
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Find course by ID
router.get("/:postID", (req, res, next) => {
  const id = req.params.postID;
  Course.findById(id)
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// Add new course
router.post("/", (req, res, next) => {
  const newPost = new Post({
    _id: new mongoose.Types.ObjectId(),
    identity: req.body.identity,
    text: req.body.text,
    timestamp: new Date(),
    likes: 0,
    hateSpeechFlag: false,
  });

  const threshold = 0.9;

  // Load the model. Users optionally pass in a threshold and an array of
  // labels to include.
  toxicity.load(threshold).then((model) => {
    const sentences = ["you suck"];
    model.classify(sentences).then((predictions) => {
      res.send(predictions);
    });
  });

  

  //   newPost
  //     .save()
  //     .then((result) => {
  //       console.log(result);
  //       res.status(201).json({
  //         message: "New Post created!",
  //         createdPost: result,
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.status(500).json({
  //         error: err,
  //       });
  //     });
});

module.exports = router;
