const express=require('express');
const routes=express.Router();
exports.routes = routes;
const adminCtrl=require('../controllers/adminController');
const AdminModel=require('../models/AdminModel');
const passport = require('passport');
const {check}=require('express-validator');

// LOGIN
routes.get('/signIn',adminCtrl.signIn);
routes.post('/checkSignIn',passport.authenticate('local',{failureRedirect:'/signIn'}),adminCtrl.checkSignIn);
routes.get('/logout',passport.checkAuthUser,adminCtrl.logout);

routes.get('/dashboard',passport.checkAuthUser,adminCtrl.dashboard);
routes.get('/dashboard2',passport.checkAuthUser,adminCtrl.dashboard2);
routes.get('/dashboard3',passport.checkAuthUser,adminCtrl.dashboard3);
routes.get('/AddAdmin',adminCtrl.AddAdmin);
routes.post('/insertAdmin',AdminModel.uploadImageFile,[
    check('fname').notEmpty().withMessage("First name is required..").isLength({min:2}).withMessage("Minimum 2 Character is required"),
    check('lname').notEmpty().withMessage("Last name is required..").isLength({min:3}).withMessage("Minimum 3 Character is required"),
    check('email').notEmpty().withMessage("email is required..").isEmail().withMessage("Enter valid email").custom(async (value)=>{
        let checkEmail=await AdminModel.find({email:value}).countDocuments();
        if(checkEmail){
            throw new Error("This email is exists...please enter another email");
        }
    }),
    check('password').notEmpty().withMessage("Password is required").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/).withMessage("one digit, one small letter, small capital, and one special character with 8 to 20 characters"),
    check('gender').notEmpty().withMessage("Gender field is required.."),
    check('hobby').notEmpty().withMessage("Hobby is required.."),
    check('city').notEmpty().withMessage("City is required.."),
    check('message').notEmpty().withMessage("message is required.."),
],adminCtrl.insertAdmin);
routes.get('/ViewAdmin',passport.checkAuthUser,adminCtrl.ViewAdmin);

routes.get('/deleteAdmin/:id',adminCtrl.deleteAdmin);
routes.get('/updateAdmin/:id',adminCtrl.updateAdmin);
routes.post('/editAdmin',AdminModel.uploadImageFile,adminCtrl.editAdmin);

//profile
routes.get('/myProfile',adminCtrl.myProfile);

//verify email
routes.get('/checkEmail',(req,res)=>{
    return res.render('checkEmail');
})
routes.post('/verifyEmail',adminCtrl.verifyEmail);
routes.get('/checkOtp',adminCtrl.checkOtp);
routes.post('/verifyOtp',adminCtrl.verifyOtp);

//forget password
routes.get('/forgetPass',adminCtrl.forgetPass);
routes.post('/verifyPass',adminCtrl.verifyPass);

//change password
routes.get('/changePassword',passport.checkAuthUser,adminCtrl.changePassword);
routes.post('/changeNewPassword',adminCtrl.changeNewPassword);

routes.get('/Comments/ViewComment',adminCtrl.viewComments);

routes.use('/blogs',passport.checkAuthUser,require('../routes/blogRoute'))
routes.use('/category',passport.checkAuthUser,require('../routes/categoryRoute'))
routes.use('/',require('../routes/userRoute'));

module.exports=routes;