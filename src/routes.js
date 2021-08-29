const routes = require('express').Router();

const authMiddleware = require('./app/middleware/auth');

const AuthController = require('./app/controllers/AuthController');

routes.post('/login', AuthController.store);

routes.use(authMiddleware);

routes.all('/dashboard', (req, res) => {
  return res.status(200).send();
});

module.exports = routes;
