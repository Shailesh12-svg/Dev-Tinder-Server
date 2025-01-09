const express = require('express')
const {userAuth} = require("../middlewares/auth")
const profileRouter = express.Router();
const {validateEditProfile,validateInputPassword} = require('../utils/validation')
const bcrypt = require('bcrypt')



//PROFILE API
profileRouter.get('/profile',userAuth,async(req,res)=>{
    try{
    const user= req.user;
    
    if(!user){
        throw new Error("User not found")
    }
    res.json(user)
    }
    catch(err){
        res.status(400).send("Something went wrong.."+err.message)
    }
})

profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
    try{
    //Validate my things req.body
    if(!validateEditProfile(req)){
        throw new Error("Invalid Edit request")
    }
    const user = req.user;
    

    Object.keys(req.body).forEach(key=>user[key]=req.body[key])
    user.save();
    res.status(200).json({message:"User data successfully updated",user})

}
catch(err){
    res.status(400).send("OOPS SOMETHING WENT WRONG...."+err.message)
}





})

profileRouter.patch('/profile/forgetpassword',userAuth,async(req,res)=>{
try{
//Valdiate your inputs
if(!validateInputPassword(req)){
    throw new Error("Invalid Inputs...")
}
//hash meh stored hai password database k andr i need to get the hash
//You need to find out the user 

const user = req.user;

if(!user){
    throw new Error('User not found..')
}


//first of all i can get  that password hash then replace it with my new password
const newPassword = req.body.password;

//using brcypt encrypt that one ..
 const hashedPassword = await bcrypt.hash(newPassword,10)

 user.password = hashedPassword;

//then save the database 

await user.save();
res.status(200).json({message:'Password updated sucessfully..'})
}catch(err){
    res.status(400).send("Oops something went wrong....")
}})

module.exports =profileRouter;