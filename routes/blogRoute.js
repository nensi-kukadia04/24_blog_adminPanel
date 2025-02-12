const express=require('express');
const Blog=require('../models/blogModel');
const routes=express.Router();
const blogcontroller=require('../controllers/blogController');
const {check}=require('express-validator');

//add
routes.get('/',blogcontroller.addBlog);
routes.post('/insertblog',Blog.uploadImageFile,[
    check('title').notEmpty().withMessage("Title is required..").isLength({min:2}).withMessage("Minimum 2 Character is required"),
    check('description').notEmpty().withMessage("Description is required..").isLength({min:9}).withMessage("Minimum 2 Character is required"),
    check('author').notEmpty().withMessage("Author is required..").isLength({min:2}).withMessage("Minimum 2 Character is required"),
],blogcontroller.insertblog);

//view
routes.get('/viewBlogs',blogcontroller.viewBlogs);

//delete
routes.get('/deleteblog/:id',blogcontroller.deleteblog);

//update
routes.get('/updateblog',blogcontroller.updateblog);
routes.post('/editBlog',Blog.uploadImageFile,blogcontroller.editBlog);

//active
routes.get('/activeStatus',blogcontroller.activeStatus);

//deactive
routes.get('/activeStatusTrue',blogcontroller.activeStatusTrue);

module.exports=routes;