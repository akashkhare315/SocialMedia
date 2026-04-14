const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      maxlength: 1000,
    },
    image: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      }
    ],
    comments: [
      {
        text: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        }
      }
    ]
  },
  { timestamps: true }
);

const postModel = mongoose.model("post", postSchema);
module.exports = postModel;
