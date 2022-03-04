"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.object = void 0;
const loginValidator_1 = require("./loginValidator");
const userValidators_1 = require("./userValidators");
const postValidators_1 = require("./postValidators");
const signupValidator_1 = require("./signupValidator");
exports.object = {
    login: loginValidator_1.loginSchema,
    signup: signupValidator_1.signupSchema,
    user: { updateSchema: userValidators_1.updateSchema, followUser: userValidators_1.followUser },
    post: { updatePost: postValidators_1.updatePost, createPost: postValidators_1.createPost },
};
