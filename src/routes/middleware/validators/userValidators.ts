import * as Joi from "joi";

export const updateSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

export const followUser = Joi.object().keys({
  userID: Joi.string().required(),
});
