const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
require("dotenv").config();

const toxicity = require("@tensorflow-models/toxicity");

// For the default version
const algoliasearch = require("algoliasearch");

const algoappid = process.env.ALGOLIA_APP_ID || "";
const algoadminid = process.env.ALGOLIA_ADMIN_API || "";

const client = algoliasearch(algoappid, algoadminid);
const index = client.initIndex("hashtags");

router.post("/by-date", (req, res, next) => {
  const q_date = req.body.date;

  Post.find({
    timestamp: { $gte: new Date(q_date) },
  })
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
router.post("/add", (req, res, next) => {
  const newPost = new Post({
    _id: new mongoose.Types.ObjectId(),
    identity: req.body.identity,
    text: req.body.text,
    timestamp: new Date(),
    hashtags: req.body.hashtags,
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
        newPost
          .save()
          .then((result) => {
            let objectID = result._id;
            delete result._id;

            index
              .saveObjects([{ objectID, ...result }])
              .then(({ objectIDs }) => {
                console.log(objectIDs);

                res.status(201).json({
                  message: "New Post created!",
                  createdPost: result,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  message: err,
                  createdPost: null,
                });
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
