const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check } = require('express-validator')
const profileController = require('../../controllers/profileController')

// route get api/profile/me
router.get('/me', auth, profileController.get_profile_data)

// post api/profile craete or update profile private
router.post('/', [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
]], profileController.create_update_profile)

// get api/profile get all profile public
router.get('/', profileController.get_all_profile)

// get api/profile/users/:user_id get profile by id public
router.get('/user/:user_id', profileController.get_profile_id)

// delete api/profile delete profile user and post
router.delete('/', auth, profileController.delete_profile_post)

// put api/profile/experience add profile experience
router.put('./experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], profileController.put_profile_experience)

module.exports = router
