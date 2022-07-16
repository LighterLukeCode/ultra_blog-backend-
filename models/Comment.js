import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    require: true,
  },
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   require: true,
  // },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});

export default mongoose.model("Comment", CommentSchema);
