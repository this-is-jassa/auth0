const {login, register, logout} = require('../middleware/auth.middleware');
const Router = require('express').Router()


Router.post('/login', login);
Router.post('/register', register);
Router.post('/logout', logout);

module.exports = Router;