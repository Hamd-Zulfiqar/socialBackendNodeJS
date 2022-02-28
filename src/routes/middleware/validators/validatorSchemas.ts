import { loginSchema } from "./loginValidator";
import { updateSchema, followUser } from "./userValidators";
import { signupSchema } from "./signupValidator";

export const object = {
  login: loginSchema,
  signup: signupSchema,
  user: { updateSchema, followUser },
};
