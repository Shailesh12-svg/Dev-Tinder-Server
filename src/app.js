const express = require('express')
const app = express();
const port =8000;
const connectDB =require("./config/database")
const cookieParser = require('cookie-parser')
const cors = require('cors')
const authRouter = require('./routes/auth');
const connectionRequestRouter = require('./routes/connectionRequest');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user')
//Middlewares
app.use(express.json()); //for parsing the JSON OBJECTS


app.use(cors({
    origin: "http://localhost:5173/", // Frontend URL
    credentials: true, // Allow cookies and credentials
}));
app.use(cookieParser());
//How you would be using that 

app.use('/',authRouter);
app.use('/',connectionRequestRouter)
app.use('/',profileRouter)
app.use('/',userRouter)




connectDB().then(()=>{
    console.log("Database connection established")
    app.listen(port,()=>{
        console.log(`Dev-Tinder server is running on ${port}`)
    })
}).catch(err=>{
    console.log("Opps Something went wrong ")
})




