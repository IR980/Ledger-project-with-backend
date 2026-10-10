const express = require("express")
const dns = require('dns')
const authRouter = require('./routes/auth.routes')
dns.setServers(["8.8.8.8", "8.8.4.4"])
const app = express()

app.use("/api/auth", authRouter);
module.exports = app;