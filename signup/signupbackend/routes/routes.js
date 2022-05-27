const express = require('express')
const router = express.Router()
const signUpTemplateCopy = require('../models/SignUpModels')
const bcrypt = require('bcrypt')

router.post('/signup', (request, response) => {
  // const saltPassword = await bcrypt.genSalt(10)
  // const securePassword = await bcrypt.hash(request.body.passowrd, saltPassword)

  const signedUpUser = new signUpTemplateCopy({
    fullName: request.body.fullName,
    userName: request.body.userName,
    email: request.body.email,
    password: request.body.password,
    courseEnrolled: request.body.courseEnrolled,
  })
  signedUpUser
    .save()
    .then((data) => {
      response.json(data)
    })
    .catch((error) => {
      response.json(error)
    })
})

module.exports = router
