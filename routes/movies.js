const router = require('express').Router();
const {
  getUserMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const {
  validationCreateMovie, validationDeleteMovie,
} = require('../utils/validationRequest');

router.get('/', getUserMovies);
router.post('/', validationCreateMovie, createMovie);
router.delete('/:movieId', validationDeleteMovie, deleteMovie);

module.exports = router;
