const express = require("express")
const dns = require('dns')
const cookieParser = require("cookie-parser")



dns.setServers(["8.8.8.8", "8.8.4.4"])


const app = express()

// middleware
app.use(express.json())
app.use(cookieParser())

// Routes
const authRouter = require('./routes/auth.routes')
const accountRouter = require('./routes/account.routes')

// use routes
app.use("/api/auth", authRouter);
app.use('/api/account',accountRouter)
module.exports = app;