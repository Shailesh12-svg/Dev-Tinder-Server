const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const Users = require('../models/user');
const userRouter = express.Router();

userRouter.get('/user/requests/received',userAuth,async (req,res)=>{
    try{
    const loggedInUser = req.user;

    //LOGIC

    const connectionRequest = await ConnectionRequest.find({
        toUserId:loggedInUser,
        status :"interested",
    
    }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","about"])
    
    if(connectionRequest.length===0){
        res.status(400).json({message:"No connection request there..."})
    }else{
        res.status(200).json({message:"Pending connection requests: ",connectionRequest})
    }
 }catch(err){
    res.status(400).json({
        message:"Connection request not found.."+err.message
    })
 }
})

userRouter.get('/user/connections',userAuth,async(req,res)=>{
    try{
    const loggedInUser =req.user;

    const connectionRequest = await ConnectionRequest.find({
        $or:[
            {fromUserId:loggedInUser,status:"accepted"},
            {toUserId:loggedInUser,status:"accepted"}
        ]
    }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","about"])
      .populate("toUserId",["firstName","lastName","photoUrl","age","gender","about"])

    const data =connectionRequest.map((row)=>{
        if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
            return row.toUserId;
        }else{
            return row.fromUserId;
        }
    })

    res.status(200).json({
        message: "Connected users:",
        data: data,
    });
}catch(err){
    res.status(400).json({message:"Oops no connections found"})
}
    
})

//toUGH ONE

userRouter.get('/user/feed',userAuth,async(req,res)=>{
    try{
    const loggedInUser = req.user;
    const page = parseInt(req.query.page)||1;
    let limit = parseInt(req.query.limit)||10;
    limit = limit>50?50:limit;

    const skip =(page-1)*limit;
    //Find me the connection request to whom we sended the connection or recieved..
    const connectionRequest = await ConnectionRequest.find({
        $or:[
            {fromUserId:loggedInUser},
            {toUserId:loggedInUser},
        ]
    }).select("fromUserId toUserId");

    const hideUserFeed = new Set();

    connectionRequest.forEach(req=>{

        hideUserFeed.add(req.fromUserId.toString());
        hideUserFeed.add(req.toUserId.toString());
    });

    const users = await Users.find({
        $and:[
            {_id:{$nin:Array.from(hideUserFeed)}},
            {_id:{$ne:loggedInUser._id},
        }]
    }).select("firstName lastName photoUrl age gender about").skip(skip).limit(limit)
    res.json(users);
}catch(err){
    res.status(400).json({message:err.message})
}
});

module.exports = userRouter;