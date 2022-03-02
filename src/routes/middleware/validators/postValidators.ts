import * as Joi from "joi";

export const createPost = Joi.object().keys({
  userID: Joi.string().required(),
  caption: Joi.string().email().required(),
});

export const updatePost = Joi.object().keys({
  caption: Joi.string().required(),
});
