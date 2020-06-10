const {login, register} = require('../middleware/auth.middleware');
const Router = require('express').Router()


Router.post('/login', login);
Router.post('/register', register)

module.exports = Router;