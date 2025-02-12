const express=require('express');
const port=8000;
const app=express();
const path=require('path');
// const db=require('./config/db');
const cookieParser=require('cookie-parser');
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://kukadiyanensi838:HSDmIm2lmEgtkfVa@cluster0.j60zp.mongodb.net/LTE4").then((res) => {
        console.log("Database is Online Connected");
    })
    .catch((err) => {
        console.log("Database is not Connected",err);
    });

const session=require('express-session');
const passport=require('passport');
const localStrategy=require('./config/localStrategy');

const flash=require('connect-flash');
const flashMessage=require('./config/flashMessage');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'assets')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use(session({
    name:'blog',
    secret:'blogKey',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthUser);
app.use(flash());
app.use(flashMessage.setFlash);

app.use('/',require('./routes/adminRoute'));
// app.use('/category',require('./routes/categoryRoute'));
// app.use('/blogs',require('./routes/blogRoute'));

app.listen(port,(err)=>{
    err?console.log(err):console.log("Server is running on http://localhost:"+port);
})