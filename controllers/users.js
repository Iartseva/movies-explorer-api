const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NotFound,
  ValidationError,
  ConflictError,
} = require('../errors/allErrors');
const {
  JWT_SECRET_DEV,
  resStatusCreate,
  messageLogout,
  messageConflictError,
  messageValidationError,
  messageNotFoundError,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

function findUser(res, next, userId) {
  User.findById(userId)
    .orFail(new NotFound(messageNotFoundError))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(messageValidationError));
      } else {
        next(err);
      }
    });
}

module.exports.getUserInfo = (req, res, next) => {
  findUser(res, next, req.user._id); // берем пользователя из окружения
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound(messageNotFoundError);
    })
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ValidationError(messageValidationError));
      } else if (err.code === 11000) {
        next(new ConflictError(messageConflictError));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(resStatusCreate).send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(messageValidationError));
      } else if (err.code === 11000) {
        next(new ConflictError(messageConflictError));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV, { expiresIn: '7d' });
      return res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
      }).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  }).send({ message: messageLogout })
  .catch(next);
};
