const recipe = require('../models/recipe')
const { StatusCodes } = require('http-status-codes')

const getrecipe = async (req, res) => {
    const response = await recipe.find({ user: req.user.userId })
    res.status(StatusCodes.OK).json(response)
}

const createrecipe = async (req, res) => {
    const { content } = req.body

    const response = await recipe.create({
        user: req.user.userId,
        content: content,
    })

    res.status(StatusCodes.OK).json(response)
}

const deletrecipe = async (req, res) => {
    const { id } = req.params

    const response = await recipe.findOneAndDelete({ _id: id, user: req.user.userId })

    if (!response) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: "entry not found" })
    }

    res.status(StatusCodes.OK).json(response)
}

module.exports = { getrecipe, createrecipe, deletrecipe }