
const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const messages = require('../../env/variables');
const { registerValidation, loginValidation } = require('../helpers/user.validation');
const config = require('../../env/config');
const { addSession, removeSession, removeSessions } = require('../helpers/sessionHandler');
const jwt = require('jsonwebtoken');

login = async (req, res) => {
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });
    if (!user) return res.status(400).send({ message: messages.NO_MAIL_FOUND });


    const webToken = jwt.sign({ _id: user._id }, config.jwtSecretKey, { expiresIn: "15d" });

    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 15);


    res.cookie('auth-token', webToken, {
        expires: expireDate,
        secure: false,
        httpOnly: false
    }).send({ user });

    await addSession(user, user.sessions, webToken);

}

register = async (req, res) => {

    const { error } = registerValidation.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { name, password, email } = req.body;

    const emailExists = await userModel.findOne({ email: email });
    if (emailExists) return res.status(400).send({ message: messages.REGISTER_MAIL_EXIST });

    const salt = await bcrypt.salt(10);
    const passwordHash = await bcrypt.hash(password, salt);




    const user = new userModel({
        name: name,
        password: passwordHash,
        email: email
    });

    try {
        await user.save();
        res.status(200).send({ user: user._id })
    } catch (err) {
        res.status(400).send({ err })
    }

}

logout = async (req, res) => {

    const fromEverywhere = true;

    const webToken = req.cookie['auth-token'];
    if (!webToken) return res.status(400).send({ message: messages.LOGOUT_WITHOUT_TOKEN });

    try {
        const { _id } = jwt.verify(webToken, config.jwtSecretKey);

        const user = await userModel.findById(_id);
        user.password = '';
        const sessions = user.sessions;

        if (fromEverywhere ? await removeSessions(user) : await removeSession(user, sessions, webToken));

        res.clearCookie('auth-token').send({});

    } catch (err) {
        res.clearCookie('auth-token').status(400).message({ message: messages.INVALID_TOKEN });
    }
}

module.exports.login = login;
module.exports.register = register;
module.exports.logout = logout;
