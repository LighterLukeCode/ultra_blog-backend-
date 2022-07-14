import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { createPostValidation, loginValidation, registerValidation } from "./validations.js";
import { PostControllers, UserControllers } from "./controllers/index.js";
import { checkAuth, handleValidationError } from "./utils/index.js";
import cors from "cors";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB ok"))
  .catch(err => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
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

// павпв ап вап ва павпв
//  вапвап ва пва пва
//   авпва п вап ва

app.post("/auth/login", loginValidation, handleValidationError, UserControllers.login);
app.post("/auth/register", registerValidation, handleValidationError, UserControllers.register);
app.get("/auth/me", checkAuth, UserControllers.getMe);

/**********************Posts *****************/
app.post("/posts", checkAuth, createPostValidation, handleValidationError, PostControllers.create);
app.get("/posts", PostControllers.getAllPosts);
app.get("/posts/tags", PostControllers.getLastTags);
app.get("/tags", PostControllers.getLastTags);
app.get("/posts/:id", PostControllers.getOnePost);
app.delete("/posts/:id", checkAuth, PostControllers.removePost);
app.patch("/posts/:id", checkAuth, createPostValidation, handleValidationError, PostControllers.update);

app.listen(process.env.PORT || 4444, err => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
