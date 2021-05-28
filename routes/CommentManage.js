const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Comment = require("../models/Comment");

const toxicity = require("@tensorflow-models/toxicity");

router.get("/get/:postId", (req, res, next) => {
  Comment.find({ parentId: req.params.postId })
    .exec()
    .then((docs) => {
      res.status(200).json({ postlist: docs });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        postlist: null,
      });
    });
});

router.post("/add/:postId", (req, res, next) => {
  const newComment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    parentId: req.params.postId,
    text: req.body.text,
    timestamp: new Date(),
  });

  toxicity.load().then((model) => {
    model.classify(req.body.text).then((predictions) => {
      if (predictions[predictions.length - 1].results[0].match) {
        console.log("Toxic message detected. Deleting now...");
        res.status(409).json({
          message: "Your Post is Toxic Content, so can't be posted !",
          createdPost: null,
        });
      } else {
        newComment
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: "New Post created!",
              createdPost: result,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              message: err,
              createdPost: null,
            });
          });
      }
    });
  });
});

module.exports = router;
