const Calorie = require("../models/calories")
const User = require("../models/user")
const { StatusCodes } = require('http-status-codes')

const createCalorieLog = async (req, res) => {
  const { date, description, calories } = req.body

  const [year, month, day] = date.split('-').map(Number)
  const targetDate = new Date(year, month - 1, day)

  const entry = await Calorie.create({
    user: req.user.userId,
    date: targetDate,
    description,
    calories,
  })

  res.status(StatusCodes.OK).json(entry)
}


const deleteCalorieLog=async(req,res)=>{
    const { id } = req.params

  const response=await Calorie.findOneAndDelete({_id:id,user:req.user.userId})

  if (!response) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "entry not found" })
  }
  res.status(StatusCodes.OK).json(response)



}

const getCalorieLogs = async (req, res) => {
  const { date } = req.query

  let targetDate
  if (date) {
    const [year, month, day] = date.split('-').map(Number)
    targetDate = new Date(year, month - 1, day)
  } else {
    const now = new Date()
    targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (targetDate.getTime() > today.getTime()) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "cannot access future dates" })
  }

  const entries = await Calorie.find({ user: req.user.userId, date: targetDate })
  const total = entries.reduce((sum, e) => sum + e.calories, 0)

  const user = await User.findById(req.user.userId)
  const goal = user.calculateMaintenanceCalories()

  res.status(StatusCodes.OK).json({ entries, total, goal })
}

module.exports = { createCalorieLog, getCalorieLogs,deleteCalorieLog }