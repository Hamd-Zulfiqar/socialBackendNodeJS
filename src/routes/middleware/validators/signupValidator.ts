import * as Joi from "joi";

export const signupSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  DOB: Joi.date().required(),
  gender: Joi.boolean().required(),
});
