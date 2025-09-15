const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config')

function authMiddleware(req, res, next) {

    try {
        const token = req.headers["token"];

        const decodedData = jwt.verify(token, JWT_SECRET)
        if(decodedData) {
            req.userId = decodedData._id
            next()
        } else {
            res.status(403).json({
                msg : "you are not signed in"
            })
        }
    } catch {
        res.status(401).json({
            msg:'No token provided'
        })
    }
}

module.exports = {
    authMiddleware
}