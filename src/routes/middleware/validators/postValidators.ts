import * as Joi from "joi";

export const createPost = Joi.object().keys({
  userID: Joi.string().required(),
  caption: Joi.string().required(),
});

export const updatePost = Joi.object().keys({
  caption: Joi.string().required(),
});
