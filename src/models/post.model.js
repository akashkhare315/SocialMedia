const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const postModel = mongoose.model("post", postSchema);
module.exports = postModel;
