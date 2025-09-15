const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { taskModel } = require('../db');

const taskRouter = express.Router();

taskRouter.post('/', authMiddleware , async (req , res) => {
    const { title, description, category} = req.body;
    const userId = req.userId; 

    if(!title || !category || !userId ) {
        return res.status(403).json({
            msg: "title , dispricption and userId are required"
        })
    }

    const task = await taskModel.create({
        userId: userId,
        title: title,
        description : description,
        category: category,
        createdAt: Date.now()
    })

    res.status(201).json(task)
})

taskRouter.get('/', authMiddleware ,async(req, res)=> {
    try {
        const filteredIds = {userId: req.userId}
        if(req.query.category) {
            filteredIds.category = req.query.category
        }

        const tasks = await taskModel.find(filteredIds).select("title category isDone");

        const formatted = tasks.map(task => ({
            id: task._id,
            title: task.title,
            category: task.category,
            isDone: task.isDone
        }));

    res.json(formatted);
    } catch {
        res.status(500).json({
            msg: "Error fetching tasks"
        })
    }
})

taskRouter.patch('/:id', authMiddleware, async(req, res) => {
    try {
        const taskId = req.params.id;
        const {isDone} = req.body;
        
        const task = await taskModel.findOneAndUpdate(
            { _id: taskId, userId: req.userId },
            { isDone: isDone },
            {new: true}
        )
        if (!task) {
            return res.status(404).json({ msg: "Task not found or not yours" });
        }

        res.json({
            id: task._id,
            title: task.title,
            category: task.category,
            isDone: task.isDone
        });
    } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Error updating task" });
    }
})

taskRouter.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;

    const deleted = await taskModel.findOneAndDelete({
      _id: taskId,
      userId: req.userId
    });

    if (!deleted) {
      return res.status(404).json({ msg: "Task not found or not yours" });
    }

    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting task" });
  }
});




