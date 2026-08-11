const mongoose = require('mongoose')

const SavedRecipeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('recipe', SavedRecipeSchema)