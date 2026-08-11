// routes/user.js
const express = require('express')
const { getProfile, updateProfile } = require('../controllers/auth')
const userRouter = express.Router()

userRouter.get('/me', getProfile)
userRouter.patch('/me', updateProfile)

module.exports = userRouter