const mongoose = require('mongoose')

const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://ShaileshMallick:Shailesh20@learningdatabase.kyj7ysp.mongodb.net/dev-Tinder");
}

module.exports =connectDB;
