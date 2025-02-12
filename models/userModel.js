const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        default:true
    }
},
    {timestamps:true}
)

const UserModel=mongoose.model("UserModel",UserSchema);
module.exports=UserModel;