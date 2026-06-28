const Task = require("../models/taskModel.js");

const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !title.trim() || !description || !description.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required"
            });
        }

        const task = new Task({ title, description });
        await task.save();

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllTasks = async (req, res) => {
    try {
        const task = await Task.find()

        res.status(200).json({
            success: true,
            count: task.length,
            data: task
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getSingleTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }
        res.status(200).json({
            success: true,
            data: task
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }
        res.status(200).json({
            success: true,
            data: task
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }
        res.status(200).json({
            success: true,
            data: task,
            message: "Task deleted successfully"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getAllTasks, getSingleTask, createTask, updateTask, deleteTask };