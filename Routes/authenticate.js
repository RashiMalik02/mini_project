const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { userModel } = require('../db');
const {JWT_SECRET} = require('../config')

const app = express();
app.use(express.json());
const authRouter = express.Router();

authRouter.post('/register', async (req , res) => {
    let {name, email , password} = req.body;

    const passwordHash = await bcrypt.hash(password, 5);
    try {
        await userModel.create({
            name: name,
            email: email,
            passwordHash: passwordHash,
            createdAt: Date.now()
        })
        res.status(201).json({
            msg: "Creates!"
        });
    } catch {
        res.status(403).json({
            msg: "Please check your credentials, Signup failed"
        })
    }
})

authRouter.post('/login', async(req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await userModel.findOne({
            email: email
        })
        if(!user) {
            res.status(403).json({
                msg: "user not found"
            })
        }
        const matchedPass = bcrypt.compare(password, user.passwordHash);

        if(matchedPass) {
            const token = jwt.sign({
                 _id: user._id
            }, JWT_SECRET);
            res.json({
                token : token
            })
        } else {
            res.status(403).json({
                msg : 'Wrong password'
            })
        }
    } catch {
        res.status(403).json({
            msg: 'user does not exist'
        })
    }
})

module.exports = {
    authRouter
}