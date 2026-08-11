const mongoose = require('mongoose')

const HabitCompletionSchema = new mongoose.Schema({
    habit: {
        type: mongoose.Types.ObjectId,
        ref: 'habits',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: true
    },
})

HabitCompletionSchema.index({ habit: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('HabitCompletion', HabitCompletionSchema)