const express = require('express')
const router = express.Router()
const signUpTemplateCopy = require('../models/userModels')
const bcrypt = require('bcrypt')
const {
  login,
  signup,
  getAllUsers,
  setAvatar,
  logOut,
} = require('../controllers/userController')
router.post('/signup', signup)

module.exports = router
