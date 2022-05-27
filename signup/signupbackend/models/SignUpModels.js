const mongoose = require('mongoose')

const signUpTemplate = new mongoose.Schema({
  fullName: {
    type: String,
    requred: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  courseEnrolled: {
    type: Array,
    required: true,
  },
})

module.exports = mongoose.model('Usertable', signUpTemplate)
