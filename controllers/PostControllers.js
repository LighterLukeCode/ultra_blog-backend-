import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map(obj => obj.tags)
      .flat()
      .slice(0, 5);
    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить тэги",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось найти статью",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Не удалось найти статью, мяк",
          });
        }
        res.json(doc);
      }
    )
      .populate("user")
      .populate("comments.user");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const removePost = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete({ _id: postId }, (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Не удалось удалить статью",
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: "Не удалось найти статью, мяк",
        });
      }
      res.json({
        success: true,
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать пост",
    });
  }
};

export const createCom = async (req, res) => {
  // find out which post you are commenting
  const id = req.params.id;
  // get the comment text and record post id
  const comment = new CommentModel({
    text: req.body.comment,
    post: id,
  });
  // save comment
  await comment.save();
  // get this particular post
  const postRelated = await PostModel.findById(id);
  // push the comment into the post.comments array
  postRelated.comments.push(comment);
  // save and redirect...
  await postRelated.save();

  res.json(postRelated.comments);
};

export const createComm = (req, res) => {
  const comment = {
    text: req.body.text,
    user: req.userId,
  };
  PostModel.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("user")
    .populate("comments.user")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
};

// export const createComm = async (req, res) => {
//   const comment = { text: req.body.text };
//   comment.user = req.userId;
//   console.log(req.userId);

//   let result = await PostModel.findByIdAndUpdate(
//     req.body.postId,
//     req.userId,
//     {
//       $push: { comments: comment },
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("user")
//     .exec();
//   res.json(result);
// };
