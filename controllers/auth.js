const User=require('../models/user')
const { BadRequest, Unauthenticated } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const user = require('../models/user')
const { response } = require('express')


const register= async (req,res)=>{

    const user=await User.create({...req.body})

    const token =user.CreateJWT()

    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

const login =async(req,res)=>{

    const {email,password}=req.body

    if(!email || !password)
    {
        throw new BadRequest('please provide email and password')
    }

    const user=await User.findOne({email})

    if(!user)
    {
        throw new Unauthenticated('invalid credentials')
    }

  const isMatch = await user.ComparePassword(password)
    if(!isMatch)
    {
        throw new Unauthenticated('invalid credentials')
    }

    const token = user.CreateJWT()

    res.status(StatusCodes.OK).json({user:{name:user.name},token})


}

const getProfile = async (req, res) => {
    const user = await User.findById(req.user.userId)
    const goal = user.calculateMaintenanceCalories()

    res.status(StatusCodes.OK).json({
        name: user.name,
        email: user.email,
        weight: user.weight,
        height: user.height,
        age: user.age,
        sex: user.sex,
        activityLevel: user.activityLevel,
        goal,
    })
}

const updateProfile = async (req, res) => {
    const updated = await User.findByIdAndUpdate(
        req.user.userId,
        { ...req.body },
        { new: true, runValidators: true }
    )

    res.status(StatusCodes.OK).json(updated)
}

module.exports = { register, login, getProfile, updateProfile }