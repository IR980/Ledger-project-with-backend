const userModel = require('../models/user.model')
const jwt = require ("jsonwebtoken");

async function authMiddleware(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message: "unauthorized access token is missing"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await userModel.findById(decoded.userId);

        if(!user){
            return res.status(401).json({
                message: "unauthorized access token is invalid"
            })
        }

        req.user = user;
        return next()
    } catch (err) {
        console.log(err)
        res.status(401).json({
            message: "unauthorized acess token is invalid"
        })
    }
}

async function authSystemUserMiddleware(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(401).json({
            message: "Invalid access . token is missing"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if(!user || !user.systemUser){
            return res.status(403).json({
                message: "FOrbidden access not a system user"
            })
        }
        req.user = user;
        return next()
    }catch(err){
        return res.status(401).json({
            message: "unauthorized access"
        })
    }
}

module.exports = {authMiddleware, authSystemUserMiddleware};