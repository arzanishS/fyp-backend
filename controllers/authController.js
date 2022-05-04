const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/UserModel')

exports.getAuth = async function (req, res) {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Server Error')
  }
}

exports.getTokenLogin = async function (req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { email, password } = req.body
  try {
    // see if user exist
    const user = await User.findOne( { $or:[ {'email': email}, {'cnic': email}, {'phone': email} ]})
    if (!user) {
      return res.status(400).json({ error: 'invalid credential' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credential' })
    }
    // return jsonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    }
    
    jwt.sign(payload, 'mysecrettoken',
      { expiresIn: 360000 },
      (error, token) => {
        if (error) throw error
        res.json({ token, user })
      }
    )
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({error: error.message})
  }
}
