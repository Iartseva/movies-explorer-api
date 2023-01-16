const Movie = require('../models/movie');
const {
  ValidationError,
  NotFound,
  ForbiddenError,
} = require('../errors/allErrors');
const { resStatusCreate } = require('../utils/constants');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.getUserMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movies) => {
      res.status(resStatusCreate).send(movies);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Указаны некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFound('Фильм с указанным id не найден');
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять фильм другого пользователя');
      }
      movie.remove()
        .then(() => res.send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Указаны некорректные данные'));
      } else {
        next(err);
      }
    });
};
