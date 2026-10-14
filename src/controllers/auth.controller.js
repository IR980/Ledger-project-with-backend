const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email");
// user register controller
// post - /api/auth/register
async function userRegister(req, res) {
    const {email, name, password} = req.body;

    const emailAlreadtExist =  await userModel.findOne({
        email: email
    });

    if(emailAlreadtExist){
        return res.status(422).json({
            message: "User Already Exists",
            status: "Failed"
        })
    }

    const user = await userModel.create({
        email, name, password
    })

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "3d"})
    res.cookie("token", token)

    res.status(201).json({
        message: "create successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
        },
        token
    })

    await emailService.sendRegistrationMail(user.email, user.name);
}

// user login controller
// post - api/auth/login

async function userLogin(req, res) {
    const {email, password} = req.body

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message: "Email and Password is invalid"
        })
    }

    const isValidPassword = await user.comparePassword(password)
    if(!isValidPassword){
        return res.status(401).json({
            message: "Email and Password is invalid"
        })
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "3d"})
    res.cookie("token", token)

    res.status(200).json({
        message: "user logged in successfull",
        user:{
            _id: user._id,
            email: user.email,
            name: user.name,
            password: user.password
        },
        token
    })
}

module.exports = {userRegister, userLogin};