const jwt = require('jsonwebtoken');
const UserModel = require('../models/user')
const userAuth = async (req,res,next)=>{
    try{
    //1}Read the token

    const cookies= req.cookies;

    const{token}=cookies;

    if(!token){
        return res.status(401).send("Please Login!")
    }

    //2}Validate the token

    const decodedMessage = await jwt.verify(token,"DEV@TINDER$597");
    const {_id}= decodedMessage;
    //3}User find out
    const user = await UserModel.findById(_id);

    if(!user){
        throw new Error("Invalid User")
    }else{
        req.user = user;
        next();

    }
}
catch(err){
    res.status(400).send("Oops something went wrong...")
}
}


module.exports={
    userAuth
}