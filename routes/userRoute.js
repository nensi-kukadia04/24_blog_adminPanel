const express=require('express');
const routes=express.Router();
const CommentModel=require('../models/CommentModel');
const userCtrl=require('../controllers/userController');
const passport=require('passport');
const {check}=require('express-validator');
const adminCtrl = require('../controllers/adminController');

routes.get('/',userCtrl.home);
routes.get('/singlePage/:id',userCtrl.singlePage);
routes.post('/singlePage/CommentSection',CommentModel.uploadImage,[
    check('name').notEmpty().withMessage("Name is required").isLength({min:2}).withMessage("Minimum 2 character is required"),
    check('email').notEmpty().withMessage("Name is required").isEmail().withMessage("Enter Valid email").custom(async(value)=>{
        let checkEmail= await CommentModel.find({email:value}).countDocuments();
        if(checkEmail){
            throw new Error("This email is exists..please enter another email");
        }
    }),
    check('comment').notEmpty().withMessage("comment is required").isLength({min:2}).withMessage("Minimum 2 character is required")
],userCtrl.CommentSection);

// Login 
routes.get('/userLogin',async(req,res)=>{
    return res.render('userPanel/userLogin');
})
routes.post('/checkLogin',passport.authenticate("userAuth",{failureRedirect:'/userLogin',failureFlash:"User details not matched"}),userCtrl.checkLogin);

// register 
routes.post('/addUserData',userCtrl.addUserData);

//logout
routes.get('/userLogout',userCtrl.userLogout);

//like
routes.get('/setlikesByUser/:commentId',userCtrl.setlikesByUser);

//dislike
routes.get('/setDisLikesByUser/:commentId',userCtrl.setDisLikesByUser);

// routes.get('/myProfile',passport.checkAuthUser,userCtrl.myProfile);

//verify email
routes.get('/checkUserEmail',(req,res)=>{
    return res.render('userPanel/checkUserEmail');
})
routes.post('/verifyUserEmail',userCtrl.verifyUserEmail);
routes.get('/checkUserOtp',userCtrl.checkUserOtp);
routes.post('/verifyUserOtp',userCtrl.verifyUserOtp);

//forget password
routes.get('/forgotUserPass',userCtrl.forgotUserPass);
routes.post('/verifyUserPass',userCtrl.verifyUserPass);

//change password
routes.get('/changeUserPassword',userCtrl.changeUserPassword);
routes.post('/changeUserNewPassword',userCtrl.changeUserNewPassword);

module.exports=routes;