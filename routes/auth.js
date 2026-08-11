const express=require('express')
const {register,login,updateProfile,getProfile}=require('../controllers/auth')
const authRouter=express.Router()

authRouter.route('/login').post(login)
authRouter.route('/register').post(register)
authRouter.route('/me').get(getProfile)
authRouter.route('/me').patch(updateProfile)
module.exports = authRouter


