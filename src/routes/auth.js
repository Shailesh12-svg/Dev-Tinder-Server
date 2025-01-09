const express = require('express');
const {validateSignUp} = require('../utils/validation')

const authRouter = express.Router();
const UserModel = require('../models/user')
const bcrypt = require('bcrypt')
const validator = require('validator')


authRouter.post('/signup',async(req,res)=>{

    try{

        //Validate your requests
        validateSignUp(req);

        //Encrypt your password 

        const {firstName,lastName,emailId,password}= req.body;

        const passwordHash = await bcrypt.hash(password,10)

        const user = new UserModel({
            firstName,
            lastName,
            emailId,
            password:passwordHash
        })


    await user.save()

    res.send("User Added successfully in our database")
    }
    catch(err){
        res.status(400).send("Error in adding user to the database"+err.message)
    }


    //Creating a dummy object
    // const userObj={
    //     firstName:"Virat",
    //     lastName:"Kohli",
    //     emailId:"mallicksailesh957@gmail.com",
    //     password:"vil12@"
    // }

    // //Creating  a new instance of that userModel
    // try{
    // const user = new UserModel(userObj)

    // await user.save();

    // res.send("User Added successfully")

    // }catch(err){
    //     res.status(400).send("Error adding data to the database"+err.message)
    //  }
    }) 

authRouter.post("/login",async(req,res)=>{
        const {emailId,password}= req.body;
        
        //Validate the emailId
        if(!validator.isEmail(emailId)){
            res.status(400).json({message:"Invalid Credentials"})
        }
    
        const user = await UserModel.findOne({emailId:emailId});
        
    
        if(!user){
            res.status(400).json({message:"Invalid Credentials"})
        }
            const isPasswordValid = await user.validatePassword(password);
            
            if(isPasswordValid){
                //Logic
    
                //Create a JWT Token
                //expiresIn for setting expiry time of that token
                const token = await user.getJWT();
                
    
                //Add the token to cookie & SEND THE RESPONSE BACK TO THE USER 
    
                //telling that cookie will expire in 8hours... expires
    
                res.cookie("token",token,{expires:new Date(Date.now()+8*3600000)});
                res.send(user)
            }
            else{
                res.status(400).send("Error")
            }
        }
    
    )

authRouter.post('/logout',(req,res)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now())
    })

    res.send("Logout successfully...")
})

module.exports =authRouter;
