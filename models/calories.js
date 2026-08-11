const mongoose = require("mongoose")

const CalorieSchema = new mongoose.Schema({
    calories: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model("calories", CalorieSchema)