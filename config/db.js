const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/LTE4');

const db=mongoose.connection;

db.once('open',(err)=>{
    err?console.log(err):console.log("Data base is Connected Successfully....");
})

module.exports=db;