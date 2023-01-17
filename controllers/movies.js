const Movie = require('../models/movie');
const {
  ValidationError,
  NotFound,
  ForbiddenError,
} = require('../errors/allErrors');
const {
  resStatusCreate,
  messageValidationError,
  messageNotFoundError,
  messageForbiddenError,
} = require('../utils/constants');

module.exports.getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movies) => {
      res.status(resStatusCreate).send(movies);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(messageValidationError));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFound(messageNotFoundError);
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(messageForbiddenError);
      }
      movie.remove()
        .then(() => res.send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(messageValidationError));
      } else {
        next(err);
      }
    });
};
