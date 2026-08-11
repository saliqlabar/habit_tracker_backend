const mongoose = require('mongoose')

const HabitSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'please provide activity name'],
        },
        description: {
            type: String
        },
        tags: {
            type: [String],
            enum: ['study', 'health', 'religion', 'fitness', 'work', 'personal'],
            default: []
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'please provide user']
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('habits', HabitSchema) 