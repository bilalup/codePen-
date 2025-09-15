const express = require('express');
const { getUserProfile, updateProfile } = require('../controllers/userController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.get('/:username', getUserProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;