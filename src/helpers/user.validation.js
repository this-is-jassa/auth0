const joi = require('@hapi/joi');


const registerValidation = joi.object({
    name: joi.string().min(6).max(50).required(),
    email: joi.string().min(6).max(255).required().email(),
    pasword: joi.string().min(6).max(1024).required()
});

const loginValidation = joi.object({
    email: joi.string().min(6).max(255).required().email(),
    pasword: joi.string().min(6).max(1024).required()
});

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
