const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  identity: {
    type: String,
    required: true,
    trim: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  text: {
    type: String,
    required: true,
    maxlength: 256,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
