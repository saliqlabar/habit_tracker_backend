const express = require('express')
const { createCalorieLog, getCalorieLogs,deleteCalorieLog } = require('../controllers/calorie')
const calorieRouter = express.Router()

calorieRouter.get('/', getCalorieLogs)
calorieRouter.post('/', createCalorieLog)
calorieRouter.delete("/:id",deleteCalorieLog)

module.exports = calorieRouter