const router = require('express').Router();
const {
  getUserInfo, updateUserInfo,
} = require('../controllers/users');
const {
  validationUpdateUserInfo,
} = require('../utils/validationRequest');

router.get('/me', getUserInfo);
router.patch('/me', validationUpdateUserInfo, updateUserInfo);

module.exports = router;
