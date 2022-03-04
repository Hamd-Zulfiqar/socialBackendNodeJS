"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    userID: {
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: false,
    },
});
exports.default = (0, mongoose_1.model)("Post", postSchema);
