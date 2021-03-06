import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { createPostValidation, loginValidation, registerValidation } from "./validations.js";
import { CommentControllers, PostControllers, UserControllers } from "./controllers/index.js";
import { checkAuth, handleValidationError } from "./utils/index.js";
import cors from "cors";
import fs from "fs";

//process.env.MONGODB_URI
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB ok"))
  .catch(err => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

/**********************UploadImage *****************/

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

/**********************User *****************/

// павпв ап вап ва павпвgg dfg dfg df gdf dfg dfпв апвап вап
//  вапвап ва пва пваg fgd fgdfdfg d пв вап вв пва пп ва пв
//   авпва п вап ваggfd gdf gd  dfgdf вап вап вап вап вап

app.post("/auth/login", loginValidation, handleValidationError, UserControllers.login);
app.post("/auth/register", registerValidation, handleValidationError, UserControllers.register);
app.get("/auth/me", checkAuth, UserControllers.getMe);

/**********************Posts *****************/
app.post("/posts", checkAuth, createPostValidation, handleValidationError, PostControllers.create);
app.get("/posts", PostControllers.getAllPosts);
app.get("/posts/tags", PostControllers.getLastTags);
app.get("/tags", PostControllers.getLastTags);
app.get("/posts/top", PostControllers.getSortedByViewsPosts);
app.get("/posts/date", PostControllers.getSortedByDatePosts);
app.get("/posts/tags/:tag", PostControllers.getTagPosts);
app.get("/posts/:id", PostControllers.getOnePost);
app.delete("/posts/:id", checkAuth, PostControllers.removePost);
app.patch("/posts/:id", checkAuth, createPostValidation, handleValidationError, PostControllers.update);

/***********Comments*************** */
// app.get("/comments", CommentsControllers.getAllComments);
app.post("/comment", checkAuth, PostControllers.createComm);
//process.env.PORT ||
app.listen(process.env.PORT || 4444, err => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
