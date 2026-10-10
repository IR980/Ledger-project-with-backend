const mongoose = require("mongoose")

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongo db connected to database");
        
    } catch (error) {
        console.log("server is not connected to db", error);
        process.exit(1)
    }
}

module.exports = connectDB;