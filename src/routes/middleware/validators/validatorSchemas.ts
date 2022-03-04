import { loginSchema } from "./loginValidator";
import { updateSchema, followUser } from "./userValidators";
import { updatePost, createPost } from "./postValidators";
import { signupSchema } from "./signupValidator";

export const object = {
  login: loginSchema,
  signup: signupSchema,
  user: { updateSchema, followUser },
  post: { updatePost, createPost },
};
