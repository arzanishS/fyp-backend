const Profile = require('../models/ProfileModel')
const { validationResult } = require('express-validator')
const User = require('../models/UserModel')

exports.get_profile_data = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }
    res.json(profile)
  } catch (error) {
    console.log(error.message)
    req.status(500).send('Server error')
  }
}

exports.create_update_profile = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const {
    company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin
  } = req.body

  // build profile object
  const profileFields = {}
  profileFields.user = req.user.id
  if (company) profileFields.company = company
  if (website) profileFields.website = website
  if (location) profileFields.location = location
  if (bio) profileFields.bio = bio
  if (status) profileFields.status = status
  if (githubusername) profileFields.githubusername = githubusername
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim())
  }

  // build social object
  profileFields.social = {}
  if (youtube) profileFields.social.youtube = youtube
  if (twitter) profileFields.social.twitter = twitter
  if (facebook) profileFields.social.facebook = facebook
  if (linkedin) profileFields.social.linkedin = linkedin
  if (instagram) profileFields.social.instagram = instagram

  try {
    let profile = await Profile.findOne({ user: req.user.id })
    if (profile) {
      // update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true })
      return res.json(profile)
    }
    // create
    profile = new Profile(profileFields)
    profile.save()
    return res.json(profile)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('server error')
  }
}

exports.get_all_profile = async (req, res) => {
  try {
    const profile = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profile)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('server error')
  }
}

exports.get_profile_id = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }
    res.json(profile)
  } catch (error) {
    console.error(error.message)
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }
    res.status(500).send('server error')
  }
}

exports.delete_profile_post = async (req, res) => {
  try { // remove profile
    await Profile.findOneAndRemove({ user: req.user.id })
    // remove user
    await User.findOneAndRemove({ _id: req.user.id })
    res.json({ msg: 'User deleted' })
  } catch (error) {
    console.log(error.message)
    res.status(500).send('server error')
  }
}

exports.put_profile_experience = async (req, res) => {
  try {
    const { title, company, location, from, to, current, description } = req.body
    const newExp = {
      title, company, location, from, to, current, description
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.experience.unshift(newExp)
      await profile.save()
      res.json(profile)
    } catch (error) {
      console.log(error.message)
      res.status(500).send('server error')
    }
  } catch (error) {

  }
}
