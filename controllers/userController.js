const category = require("../models/categoryModal");
const Blog = require("../models/blogModel");
const CommentModel = require("../models/CommentModel");
const UserModel = require("../models/userModel");
const passport = require("passport");
const nodemailer=require('nodemailer');
const { validationResult } = require("express-validator");
const { localsName } = require("ejs");

module.exports.home = async (req, res) => {
  try {
    let allCategory = await category.find({ status: true });

    var search = "";
    if (req.query.blogSearch) {
      search = req.query.blogSearch;
    }

    let per_page = 3;
    let page = 0;
    if (req.query.page) {
      page = req.query.page;
    }

    let catId;
    if (req.query.catId) {
      catId = req.query.catId;
    }
    const allBlog = await Blog.find({
      status: true,
      ...(catId && { categoryId: req.query.catId }),
      $or: [{ title: { $regex: search } }],
    })
      .skip(page * per_page)
      .limit(per_page);

    let totalRecord = await Blog.find({
      $or: [
        { title: { $regex: search } },
        { author: { $regex: search } },
        { description: { $regex: search } },
      ],
    }).countDocuments();
    let totalCounts = Math.ceil(totalRecord / per_page);

    res.render("userPanel/home", {
      allCategory,
      totalRecord,
      allBlog,
      totalCounts,
      page,
      search,
    });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

module.exports.singlePage = async (req, res) => {
  try {
    let PostId = req.params.id;
    const UserDetails = await Blog.findById(req.params.id);
    let allCategory = await category.find({ status: true });
    const allBlogs = await Blog.find({ status: true });
    let viewComments = await CommentModel.find({ status: true ,PostId : PostId });

    return res.render("userPanel/singlePage", {
      UserDetails,
      allBlogs,
      allCategory,
      PostId,
      viewComments,
    });
  } catch (err) {
    console.log("Error fetching blog details:", err);
    return res.redirect("back");
  }
};

module.exports.CommentSection = async (req, res) => {
  try {
    let error = validationResult(req);
    console.log(error);
    console.log(req.body);
    console.log(req.file);
    let commentImage = "";
    if (req.file) {
      commentImage = CommentModel.imgPath + "/" + req.file.filename;
    }
    req.body.image = commentImage;
    let addComment = await CommentModel.create(req.body);
    if (addComment) {
      let blogDetails = await Blog.findById(req.body.PostId);
      blogDetails.commentIds.push(addComment._id);
      await Blog.findByIdAndUpdate(req.body.postId, blogDetails);
      res.redirect("/Comments/ViewComment");
    }
  } catch (err) {
    console.log("Something is wrong and cant fetch comment" + err);
    return res.redirect("back");
  }
};

// login
module.exports.checkLogin = async (req, res) => {
  try {
    req.flash("success", "User login successfully");
    res.redirect("/");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// register
module.exports.addUserData = async (req, res) => {
  try {
    if (req.body.password == req.body.cPassword) {
      let userData = await UserModel.create(req.body);
      if (userData) {
        console.log("User Register successfully");
        return res.redirect("back");
      } else {
        console.log("user not add");
        return res.redirect("back");
      }
    } else {
      console.log("Password and confirm password not matched");
      res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

//logout
module.exports.userLogout = async (req, res) => {
  try {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
        return false;
      }
      return res.redirect("/userLogin");
    });
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

//like
module.exports.setlikesByUser = async (req, res) => {
  try {
    let singleCommment = await CommentModel.findById(req.params.commentId);
    if (singleCommment) {
      let likeUserAlreadyExist = singleCommment.likes.includes(req.user._id);
      console.log(likeUserAlreadyExist);

      if (likeUserAlreadyExist) {
        let newData = singleCommment.likes.filter((v, i) => {
          if (!v.equals(req.user._id)) {
            return v;
          }
        });
        singleCommment.likes = newData;
      } else {
        // add user id into ilkes
        console.log(req.user._id);
        singleCommment.likes.push(req.user._id);
        console.log(singleCommment);
      }
      let disklikesUserAlreadyExist=singleCommment.dislikes.includes(req.user._id);
      if(disklikesUserAlreadyExist){
        let newData = singleCommment.dislikes.filter((v, i) => {
          if (!v.equals(req.user._id)) {
            return v;
          }
        })
        singleCommment.dislikes=newData;
      }
    }
    await CommentModel.findByIdAndUpdate(req.params.commentId, singleCommment);
    return res.redirect("back");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

//dislike
module.exports.setDisLikesByUser = async (req, res) => {
  try {
    let singleDisLikeCommment = await CommentModel.findById(req.params.commentId);
    if (singleDisLikeCommment) {
      let likeUserAlreadyExist = singleDisLikeCommment.dislikes.includes(req.user._id);
      console.log(likeUserAlreadyExist);

      if (likeUserAlreadyExist) {
        let newData = singleDisLikeCommment.dislikes.filter((v, i) => {
          if (!v.equals(req.user._id)) {
            return v;
          }
        });
        singleDisLikeCommment.dislikes = newData;
      } else {
        // add user id into ilkes
        console.log(req.user._id);
        singleDisLikeCommment.dislikes.push(req.user._id);
        console.log(singleDisLikeCommment);
      }
      let disklikesUserAlreadyExist=singleDisLikeCommment.likes.includes(req.user._id);
      if(disklikesUserAlreadyExist){
        let newData = singleDisLikeCommment.likes.filter((v, i) => {
          if (!v.equals(req.user._id)) {
            return v;
          }
        })
        singleDisLikeCommment.likes=newData;
      }
    }
    await CommentModel.findByIdAndUpdate(req.params.commentId, singleDisLikeCommment);
    return res.redirect("back");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

// change password 
module.exports.changeUserPassword=async(req,res)=>{
  try{
    res.render('userPanel/changeUserPassword');
  }catch(err){
    // console.log(err);
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}

module.exports.changeUserNewPassword=async(req,res)=>{
  try{
    let oldPassword=req.user;
    if(oldPassword.password==req.body.currentPassword){
      if(req.body.currentPassword!=req.body.newPassword){
        if(req.body.newPassword==req.body.confirmPassword){
          let editPassword=await UserModel.findByIdAndUpdate(oldPassword._id,{password:req.body.newPassword});
          req.flash('success',"Password Changed successfully");
          return res.redirect('/userLogout');
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

// verify email 
module.exports.verifyUserEmail=async(req,res)=>{
  try{
    let singleObj=await UserModel.find({email:req.body.email}).countDocuments();
    console.log(singleObj);
    if(singleObj==1){
      let singleAdminData=await UserModel.findOne({email:req.body.email});
      let OTP=Math.floor(Math.random()*100000);
      res.cookie('otp',OTP);
      res.cookie('email',singleAdminData.email);

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: "kukadiyanensi41@gmail.com",
          pass: "zfcdihqaffpukshq",
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
      return res.redirect('checkUserOtp');
    }
    else{
      console.log("error email:");
      req.flash('error',"Invalid  Email");
      return res.redirect('back');
    }
  }catch(err){
    console.log(err);
    return res.redirect('back');
  }
}

module.exports.checkUserOtp=async(req,res)=>{
  try{
    return res.render('userPanel/checkUserOtp');
  }
  catch(err){
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}
module.exports.verifyUserOtp=async(req,res)=>{
  try{
    console.log(req.body);
    console.log(req.cookies.otp);
    if(req.body.otp=req.cookies.otp){
      res.clearCookie('otp');
      res.redirect('/forgotUserPass');
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

module.exports.forgotUserPass=async(req,res)=>{
  try{
    return res.render('userPanel/forgetUserPassword');
  }
  catch(err){
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}

module.exports.verifyUserPass=async(req,res)=>{
  try{
    if(req.body.newPassword==req.body.confirmPassword){
      let checkLastTime=await UserModel.find({email:req.cookies.email}).countDocuments();
      if(checkLastTime==1){
        let adminDataNew=await UserModel.findOne({email:req.cookies.email});
        let updatePass=await UserModel.findByIdAndUpdate(adminDataNew._id,{password:req.body.newPassword});
        if(updatePass){
          res.clearCookie('email');
          console.log("password Changed Successfully")
          return res.redirect('/userLogout');
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
    console.log("error of password",err);
    req.flash('error',"Something is wrong");
    return res.redirect('back');
  }
}