const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  identity: {
    type: String,
    required: true,
    trim: true,
  },
  text: {
    type: String,
    required: true,
    maxlength: 512,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  hashtags:{
    type: Array,
    default:["any-confess"]
  }

});

module.exports = mongoose.model("Post", postSchema);
