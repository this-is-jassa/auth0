
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const messages = require('../../env/variables');
const { registerValidation, loginValidation } = require('../validations/auth.validation');
const config = require('../../env/config');


login = async (req, res) => {

    try {

        const { error } = loginValidation.validate(req.body);
        if (error) throw error.details[0].message;

        const { email, password } = req.body;

        const user = await userModel.findOne({ email: email });
        if (!user) throw messages.NO_MAIL_FOUND;

        const passwordMatched = await bcrypt.compare(password, user.password);
        if (!passwordMatched) throw messages.PASSWORD_INCORRECT;

        const tokens = await Promise.all([jwt.sign({ _id: user._id }, config.accessSecret, { expiresIn: "1h" }), jwt.sign({ _id: user._id }, config.refreshSecret, { expiresIn: "1d" })])

        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);

        res.cookie('auth-token', tokens[1], {
            expires: expireDate,
            secure: true,
            httpOnly: true
        }).send({ accessToken: tokens[0] });
    }
    catch (err) {
        res.status(400).send({ message: err })
    }

}




register = async (req, res) => {

    try {

        const { error } = registerValidation.validate(req.body);
        if (error) throw error.details[0].message;


        const { name, password, email } = req.body;


        const emailExists = await userModel.findOne({ email: email });
        if (emailExists) throw messages.REGISTER_MAIL_EXIST;


        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);


        const user = new userModel({
            name: name,
            password: passwordHash,
            email: email
        });


        await user.save();

        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);


        const tokens = await Promise.all([jwt.sign({ _id: user._id }, config.accessSecret, { expiresIn: "1h" }), jwt.sign({ _id: user._id }, config.refreshSecret, { expiresIn: "1d" })])

        res.cookie('auth-token', tokens[1], {
            expires: expireDate,
            secure: true,
            httpOnly: true
        }).send({ _id: user._id, accessToken: tokens[0] });


    } catch (err) {
        res.status(400).send({ message: err });
    }

}



logout = async (req, res) => {

    try {

        const refreshToken = req.cookie['auth-token'];
        const { accessToken } = req.body;
        
        if (!refreshToken || !accessToken) throw messages.LOGOUT_WITHOUT_TOKEN;
        await Promise.all([jwt.verify(refreshToken, config.refreshSecret), jwt.verify(accessToken, config.accessSecret)])

        res.clearCookie('auth-token').send({});

    } catch (err) {
        res.status(400).send({ message: err })
    }

}

module.exports.login = login;
module.exports.register = register;
module.exports.logout = logout;
