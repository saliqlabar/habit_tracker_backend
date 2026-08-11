const express=require('express')
const {getallhabit
    ,getonehabit
    ,createhabit
    ,updatehabit
    ,deletehabit
    ,markcomplete,
    getstreak
}=require('../controllers/habits')
const habitRouter=express.Router()

habitRouter.get('/',getallhabit)
habitRouter.get('/:id',getonehabit)
habitRouter.delete('/:id',deletehabit)
habitRouter.post('/create',createhabit)
habitRouter.patch('/:id',updatehabit)
habitRouter.patch('/:id/complete',markcomplete)
habitRouter.get('/:id/streak',getstreak)





module.exports = habitRouter


