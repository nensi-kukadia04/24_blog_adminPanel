const AdminModel = require("../models/AdminModel");
const path=require('path');
const fs=require('fs');
const Blog=require('../models/blogModel');
const category=require('../models/categoryModal');
const CommentModel=require('../models/CommentModel');
const nodemailer=require('nodemailer');
const { name } = require("ejs");
const {validationResult}=require('express-validator');  

module.exports.dashboard = async(req, res) => {
  try {
    // Category chart
    let categoryData = await category.find();
    let dataCategory = [];
    let labelCategory = [];
    let totalBlogs = 0; 
    let totalCategories = categoryData.length; 

    categoryData.map((v) => {
      const blogCount = v.blogId.length;
      dataCategory.push(blogCount);
      labelCategory.push(v.categoryName);
      totalBlogs += blogCount; 
    });

    // Blog chart
    let blogData = await Blog.find({ status: true });
    let dataBlog = [];
    blogData.map((v) => {
      dataBlog.push(v.categoryId.length);
    });

    res.render("dashboard", {
      categoryData,
      labelCategory,
      dataCategory,
      dataBlog,
      totalBlogs,      
      totalCategories, 
      blogData
    });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
module.exports.dashboard2 = (req, res) => {
  try {
    res.render("dashboard2");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
module.exports.dashboard3 = (req, res) => {
  try {
    res.render("dashboard3");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
module.exports.AddAdmin =(req, res) => {
  try {
    res.render("AddAdmin",{
      errorData:[],
      old:[]
    });
  } catch (err) {
    // console.log(err);
    req.flash('error',"Something is wrong");
    return res.redirect("back");
  }
};
module.exports.insertAdmin = async (req, res) => {
  try {

    let error=validationResult(req);
    console.log(error);
    if(!error.isEmpty()){
      return res.render('AddAdmin',{
        errorData:error.mapped(),
        old:req.body
      })
    }

    console.log(req.body);
    console.log(req.file);
    let adminImage = "";
    if (req.file) {
      adminImage = AdminModel.imagePath + "/" + req.file.filename;
    }
    req.body.image = adminImage;
    req.body.name = req.body.fname + " " + req.body.lname;

    const AdminRecord = await AdminModel.create(req.body);
    if (AdminRecord) {
      // console.log("Data added Successfully");
      req.flash('success',"Admindata add successfully");
      return res.redirect("/ViewAdmin");
    } else {
      // console.log("Something is Wrong...");
      req.flash('error',"Something is wrong");
      return res.redirect("back");
    }
  } catch (err) {
    // console.log(err);
    req.flash('error',"Something is wrong");
    return res.redirect("back");
  }
};

module.exports.ViewAdmin=async(req,res)=>{
    try{
        let AdminRecord=await AdminModel.find();
        res.render('ViewAdmin',{
            AdminRecord
        })
    }catch(err){
        // console.log(err);
        req.flash('error',"Something is wrong");
        return res.redirect('back');
    }
}

module.exports.deleteAdmin=async(req,res)=>{
  let id=req.params.id;
  let deleteRecord=await AdminModel.findById(id);

  const deletePath=path.join(__dirname,"..",deleteRecord.image);
  try{
    if(deletePath){
      fs.unlinkSync(deletePath);
      req.flash('error',"AdminData delete successfully");
    }
  }catch(err){
    req.flash('error',"Something is wrong");
  }
  await AdminModel.findByIdAndDelete(id);
  return res.redirect('back');
}

module.exports.updateAdmin=async(req,res)=>{
  try{
    let SingleObj = await AdminModel.findById(req.params.id);
    res.render('editAdmin',{
      SingleObj
    });
  }catch(err){
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}
module.exports.editAdmin=async(req,res)=>{
  console.log(req.body);
  
  console.log(req.file);
  let singleData = await AdminModel.findById(req.body.id);
  console.log(singleData);
  
  if (req.file) {
     
      let imageOldpath = path.join(__dirname,'..',singleData.image);
      
      try{
         await fs.unlinkSync(imageOldpath)
  
      }
      catch(err){
          console.log("image is not found", err);
          
      }
      var newImagePath = AdminModel.imagePath+'/'+req.file.filename;
      req.body.image = newImagePath;

      await AdminModel.findByIdAndUpdate(req.body.id, req.body);
      return res.redirect('/ViewAdmin');
  }
  else{
      req.body.image = singleData.image;
    await AdminModel.findByIdAndUpdate(req.body.id,req.body);
    return res.redirect('/viewAdmin');
  }
}

//Sign In

module.exports.signIn=async(req,res)=>{
  try{
    return res.render('signIn');
  }
  catch(err){
    // console.log(err);
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}
module.exports.checkSignIn = async (req, res) => {
  try {
    req.flash('success',"Sign In successfully");
    return res.redirect("dashboard");
  } catch (err) {
    req.flash('error',"Something is wrong");
    return res.redirect("back");
  }
};

module.exports.myProfile=async(req,res)=>{
  try{
    res.render('myProfile');
  }catch(err){
    // console.log(err);
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}

// logout 
module.exports.logout=async(req,res)=>{
  try{
    req.flash('error',"Logout successfully");
    req.session.destroy(function(err){
      if(err){
        console.log(err);
        return false;
      }
      return res.redirect('signIn');
    })
  }catch(err){
    // console.log(err);
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}

module.exports.changePassword=async(req,res)=>{
  try{
    res.render('changePassword',{
      adminData: req.cookies.adminData
    });
  }catch(err){
    // console.log(err);
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}
module.exports.changeNewPassword=async(req,res)=>{
  try{
    let oldPassword=res.locals.user;
    console.log(oldPassword);
    if(oldPassword.password==req.body.currentPassword){
      if(req.body.currentPassword!=req.body.newPassword){
        if(req.body.newPassword==req.body.confirmPassword){
          let editPassword=await AdminModel.findByIdAndUpdate(oldPassword._id,{password:req.body.newPassword});
          req.flash('success',"Password Changed successfully");
          return res.redirect('logout');
        }else{
          console.log("New password and Confirm password are doesn't match.Try Again..");
          res.redirect('back');
        }
      }else{
        console.log("Current Password and new password are same.Try another..");
        res.redirect('back');
      }
    }else{
      console.log("current password is doesn't match with old pssword.Try Again..");
      res.redirect('back');
    }
  }catch(err){
    req.flash('error',"Something is wrong");
    console.log("error",err);
    return res.redirect('back');
  }
}

module.exports.verifyEmail=async(req,res)=>{
  try{
    let singleObj=await AdminModel.find({email:req.body.email}).countDocuments();
    if(singleObj==1){
      let singleAdminData=await AdminModel.findOne({email:req.body.email});
      console.log(singleAdminData);
      let OTP=Math.floor(Math.random()*100000);
      res.cookie('otp',OTP);
      res.cookie('email',singleAdminData.email);

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: "kukadiyanensi41@gmail.com",
          pass: "thlqzvuxvvmkxlwi",
        },
        tls:{
          rejectUnauthorized:false
        }
      });

      const info = await transporter.sendMail({
        from: "kukadiyanensi41@gmail.com", 
        to: "kukadiyanensi41@gmail.com",
        subject: "OTP ", 
        text: "verify OTP",
        html: `<b>your OTP is ${ OTP}</b>`, 
      });
    
      console.log("Message sent: ");

      req.flash('warning',"OTP sent successfully");
      return res.redirect('checkOtp');
    }
    else{
      console.log("invalid email");
      req.flash('error',"Invalid  Email");
      return res.redirect('back');
    }
  }catch(err){
    console.log(err);
    return res.redirect('back');
  }
}

module.exports.checkOtp=async(req,res)=>{
  try{
    return res.render('checkOtp');
  }
  catch(err){
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}
module.exports.verifyOtp=async(req,res)=>{
  try{
    console.log(req.body);
    console.log(req.cookies.otp);
    if(req.body.otp==req.cookies.otp){
      res.clearCookie('otp');
      res.redirect('/forgetPass');
    }
    else{
      console.log("Invalid OTP");
      res.redirect('back');
    }
  }
  catch(err){
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}

//forget password

module.exports.forgetPass=async(req,res)=>{
  try{
    return res.render('forgetPass');
  }
  catch(err){
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}

module.exports.verifyPass=async(req,res)=>{
  try{
    if(req.body.newPassword==req.body.confirmPassword){
      let checkLastTime=await AdminModel.find({email:req.cookies.email}).countDocuments();
      if(checkLastTime==1){
        let adminDataNew=await AdminModel.findOne({email:req.cookies.email});
        let updatePass=await AdminModel.findByIdAndUpdate(adminDataNew._id,{password:req.body.newPassword});
        if(updatePass){
          res.clearCookie('email');
          console.log("password Changed Successfully")
          return res.redirect('/signIn');
        }
        else{
          console.log("Password not Updated..Try again");
          return res.redirect('back');
        }
      }
      else{
        console.log("Email not found..Try again");
        return res.redirect('back');
      }
    }
    else{
      console.log("new Password and confirm password not matched..Try again");
      return res.redirect('back');
    }

  }
  catch(err){
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}

// view comment 

module.exports.viewComments = async (req, res) => {
  try {
    let viewComments = await CommentModel.find({});
    res.render("Comments/ViewComment", {
      viewComments,
    });
  } catch (err) {
    req.flash('error',"Something is wrong");
    return res.redirect("back");
  }
};