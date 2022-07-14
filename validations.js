import { body } from "express-validator";

export const loginValidation = [
  body("email", "Невурный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({ min: 5 }),
];

export const registerValidation = [
  body("email", "Невурный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 5 символов").isLength({ min: 5 }),
  body("fullName", "Укажите имя").isLength({ min: 3 }),
  body("avatarUrl", "Невурная ссылка на аватарку").optional().isURL(),
];

export const createPostValidation = [
  body("title", "Введите заголовок поста").isLength({ min: 3 }).isString(),
  body("text", "Введите текст поста").isLength({ min: 10 }).isString(),
  body("tags", "Неверный формат тэгов").optional().isArray(),
  body("imageUrl", "Неверная ссылка на изображение").optional().isString(),
];
