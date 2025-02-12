const mongoose=require('mongoose');

const CategorySchema=mongoose.Schema({
    categoryName:{
        type:String,
        require:true 
    },
    categoryDate:{
        type:String,
        require:true 
    },
    status:{
        type:Boolean,
        default:true
    },blogId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog'
    }],
   
},{timestamps:true}
)

const category=mongoose.model('category',CategorySchema);
module.exports=category;