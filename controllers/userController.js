const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/UserModel')

exports.create_user = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { name, email, password, phone } = req.body
  try {
    // see if user exist
    let user = await User.findOne({ email })
    if (user) {
      return res.status(404).json({ success: false, msg: 'User Already Exists' } )
    }

    let phoneno = await User.findOne({ phone })
    if (phoneno) {
      return res.status(404).json({ success: false, msg: 'Phone No Already Exists' })
    }

    // get user gravatar
    user = new User(
      {
        name,
        email,
        password,
        phone,
      })
    // encrypt password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    await user.save()
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
        res.json({ token, success: true })
      }
    )
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Server error',error.message)
  }
}

exports.get_all_users = async (req, res) => {
  try {
    const user = await User.find().sort({ date: -1 })
    res.json(user)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('server error')
  }
}

exports.updateUser = async (req, res) => {
  try {
    const filter = { _id: req.body._id }
    const updateData = req.body
    delete updateData._id
    const user = await User.findOneAndUpdate(filter, updateData, { new: true })
    res.json({ user, success: true })
  } catch (error) {
    console.log(error.message)
    res.status(500).send('server error')
  }
}

exports.delete_user = async (req, res) => {
  try { 
    // remove user
    await User.findOneAndRemove({ _id: req.query.id })
    res.json({ msg: 'User deleted' })
  } catch (error) {
    console.log(error.message)
    res.status(500).send('server error')
  }
}


