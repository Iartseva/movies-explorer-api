const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/allErrors');
const { JWT_SECRET_DEV } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    next(new UnauthorizedError('Вы не авторизованы')); // я тут
  } else {
    const token = req.cookies.jwt;
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
      req.user = payload;
      next();
    } catch (err) {
      next(new UnauthorizedError('Вы не авторизованы'));
    }
  }
};
