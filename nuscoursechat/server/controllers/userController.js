const User = require('../models/userModels')
const bcrypt = require('bcrypt')

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const usernameCheck = await User.findOne({ username })
    const emailCheck = await User.findOne({ email })
    if (usernameCheck) {
      return res.json({ msg: 'Username already exists', status: false })
    }
    if (emailCheck) {
      return res.json({ msg: 'Email already exists', status: false })
    }
    const saltPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      username,
      email,
      password: saltPassword,
    })
    delete user.password
    return res.json({ status: true, user })
  } catch (err) {
    next(err)
  }
}
