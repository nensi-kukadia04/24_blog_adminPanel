const mongoose=require('mongoose');
const path=require('path');
const multer=require('multer');
const imagePath='/uploads/Admins';

const AdminSchema=mongoose.Schema({
    name:{
        type:String,
        require:true 
    },
    email:{
        type:String,
        require:true 
    },
    password:{
        type:String,
        require:true 
    },
    gender:{
        type:String,
        require:true 
    },
    hobby:{
        type:Array,
        require:true 
    },
    city:{
        type:String,
        require:true 
    },
    image:{
        type:String,
        require:true 
    },
    message:{
        type:String,
        require:true 
    },
},
{timestamps:true}

)

const StorageImage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..',imagePath));
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now());
    }
})

AdminSchema.statics.uploadImageFile=multer({storage:StorageImage}).single('image');
AdminSchema.statics.imagePath=imagePath;

const AdminModel=mongoose.model('Admins',AdminSchema);
module.exports=AdminModel;