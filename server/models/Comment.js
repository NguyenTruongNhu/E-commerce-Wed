const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    desc: { type: String, required: true },
    blog: { type: mongoose.Types.ObjectId, ref: "Blog", required: true },
    check: { type: Boolean, default: true },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    replyOnUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parent",
});

//Export the model
module.exports = mongoose.model("Comment", commentSchema);
