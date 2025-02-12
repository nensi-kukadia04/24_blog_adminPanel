const mongoose=require('mongoose');
const imagePath="/uploads/users";
const path=require('path');
const multer=require('multer');

const CommentSchema=mongoose.Schema({
    PostId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog',
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    comment:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"UserModel"
        }
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"UserModel"
        }
    ],
    status:{
        type:Boolean,
        default:true
    },
},
    {timestamps:true}
)

const StorageImage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"..",imagePath));
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now());
    }
})

CommentSchema.statics.uploadImage=multer({storage:StorageImage}).single('image');
CommentSchema.statics.imgPath=imagePath;

const CommentModel=mongoose.model("CommentModel",CommentSchema);

module.exports=CommentModel;