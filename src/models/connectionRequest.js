const mongoose = require('mongoose');
const user = require('../models/user')

const connectionRequestSchema = new mongoose.Schema({
    //fromUserID

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:user
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:user
    },
    status:{
        type:String,
        enum:{
            values:['ignored','interested','accepted','rejected'],
            message:`{VALUE}is incorrect status type..`
        }
    }
},{
    timestamps:true,
});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest =this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself..")
    }
    next();
})

//Creating a model

const ConnectionRequest = new mongoose.model('ConnectionRequest',connectionRequestSchema);

module.exports =ConnectionRequest;
