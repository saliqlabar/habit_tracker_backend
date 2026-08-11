const express = require('express')
const { getrecipe, createrecipe, deletrecipe } = require('../controllers/recipe')
const recipeRouter = express.Router()

recipeRouter.get('/', getrecipe)
recipeRouter.post('/', createrecipe)
recipeRouter.delete('/:id', deletrecipe)

module.exports = recipeRouter