const { login, register, logout, verify } = require('../middleware/auth.middleware');
const Router = require('express').Router()


Router.post('/login', login);
Router.post('/register', register);
Router.post('/logout', verify, logout);

module.exports = Router;