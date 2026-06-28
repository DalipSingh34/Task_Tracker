const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    title: {
        type: String, required: true, trim: true
    },

    description: {
        type: String, required: true, trim: true
    },

    status: {
        type: String, enum: ["pending", "approved"], default: "pending"
    }
}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;