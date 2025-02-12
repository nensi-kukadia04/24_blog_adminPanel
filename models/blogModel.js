const mongoose=require('mongoose');
const imagePath="/uploads/blogupload";
const path=require('path');
const multer=require('multer');
const Comment=require('../models/CommentModel');
const { timeStamp } = require('console');

const BlogSchema=mongoose.Schema({
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        default:true
    },
    author:{
        type:String,
        required:true,
    },
    PostId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CommentModel'
    }]
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

BlogSchema.statics.uploadImageFile=multer({storage:StorageImage}).single('image');
BlogSchema.statics.imgPath=imagePath;

const Blog=mongoose.model("Blog",BlogSchema);

module.exports=Blog;