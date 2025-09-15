const express = require('express');
const mongoose = require('mongoose');
require('./db');

const app = express();
app.use(express.json())

const {authRouter} = require('./Routes/authenticate')
const {taskRouter} = require('./Routes/tasks')

app.use('/auth', authRouter)
app.use('/tasks', taskRouter)

app.listen(3000)
