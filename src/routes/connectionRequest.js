const express = require('express')
const {userAuth} = require("../middlewares/auth");
const connectionRequestRouter = express.Router();
const mongoose = require('mongoose')
const UserModel = require('../models/user');
const { Connection } = require('mongoose');
const ConnectionRequest = require('../models/connectionRequest');
//CONNECTION REQUEST API {Protected using userAuth}

connectionRequestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{

    try{

        //first thing to get the LoggedIn user object id ..
        
        const fromUserId =req.user._id;

        //To get me the toUserId  ...
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        //3rd Problem validate the toUserId
        // Ky kro ki joh toUserId ky woh database exist krta hai ye dekh lo simple

        const isToUserIdValid = await UserModel.findById(toUserId)

        if(!isToUserIdValid){
           return res.status(400).json({
                message:"The toUser does not exist in the database"
            })
        }



        const allowedStatus = ['ignored','interested'];
        //1st problem
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status type"
            })
        }
       
        const connection = new ConnectionRequest({
            fromUserId,toUserId,status
        })

        //2nd problem existing connection request

        const existingConnectionRequest = await ConnectionRequest.findOne({
            //USE DIMAG 

            $or:[
                 //{fromUserId,fromUserId}, // a-> a same connection bug
                {fromUserId,toUserId}, //a->b again
                {fromUserId:toUserId,toUserId:fromUserId} //b->a reverse
            ],
        });

        if(existingConnectionRequest){
            return res.status(400).json({message:"Connection request already exist.."})
        }

        const final = await connection.save();

        if(final){
            res.json({
                message:"Connection request send successfully",
                final,
            })
        }
        

    }catch(err){
        res.status(400).send("ERROR ...."+err.message);
    }

    })

connectionRequestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    //Validate status
    const {status,requestId} = req.params;
    const allowedMethods = ['accepted','rejected'];
    const user = req.user;
    //Validate the status 
    if(!allowedMethods.includes(status)){
        res.status(400).json({message:"Invalid status methods ...."})
    }

    //Imp
    console.log(user);
    const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:user._id,
        status:'interested',
    })
    console.log(connectionRequest)

    if(!connectionRequest){
        return res.status(404).json({message:'Connection request not found'})
    }
    connectionRequest.status = status;

    const data = await connectionRequest.save()

     return res.json({message:"Connection request"+status,data})

})

module.exports=connectionRequestRouter;