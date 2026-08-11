const User=require('../models/user')
const { Unauthenticated } = require('../errors')
const jwt=require('jsonwebtoken')


const auth = async (req,res,next)=> {

    const authheader=req.headers.authorization

    if(!authheader || !authheader.startsWith('Bearer'))
    {
     throw new Unauthenticated('authentication invalid')
    }

    const token=authheader.split(' ')[1]


    try {
         const payload= await jwt.verify(token,process.env.JWT_SECRET)

    req.user={
        userId:payload.userId,
        name:payload.name
    }
    next()
    } catch (error) {
          throw new Unauthenticated('authentication invalid')

    }
   
    




}

module.exports=auth