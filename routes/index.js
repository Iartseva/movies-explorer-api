const router = require('express').Router();
const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/users');
const { NotFound } = require('../errors/allErrors');
const { validationCreateUser, validationLogin } = require('../utils/validationRequest');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.post('/signout', logout);

router.use('*', (req, res, next) => {
  next(new NotFound('Cтраницы не сушествует'));
});

module.exports = router;
