const mongoose = require('mongoose');
const schema = mongoose.Schema;
const objectId = mongoose.Schema.ObjectId;

mongoose.connect(process.env.MONGO_URL);

const User = new schema({
    name: {type:String, required: true},
    email: {type: String, unique: true, required: true },
    passwordHash: String,
    createdAt: {type: Date, default: Date.now}
})

const Task = new schema({
    userId: {type:objectId , ref: "User"},
    title: {type:String, required: true},
    description: {type:String},
    category: {type:String, required: true},
    isDone: {type:Boolean, default:false},
    createdAt: {type:Date, default:Date.now}
})

const userModel = mongoose.model("User", User);
const taskModel = mongoose.model("Task", Task);

module.exports = {
    userModel: userModel,
    taskModel: taskModel
}