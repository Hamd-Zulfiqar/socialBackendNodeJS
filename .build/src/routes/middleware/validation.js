"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const validator = (validator) => {
    return async function (req, res, next) {
        try {
            const validated = await validator.validateAsync(req.body);
            console.log("Validation successful!", validated);
            next();
        }
        catch (err) {
            return res.status(500).json({ message: "API Body validation Failed" });
        }
    };
};
exports.validator = validator;
