const express=require('express');
const category=require('../models/categoryModal');
const routes=express.Router();
const {check}=require('express-validator');

const categoryCtrl=require('../controllers/categoryController');
routes.get('/',categoryCtrl.addCategory);
routes.post('/InsertCategory',[
    check('categoryName').notEmpty().withMessage("Category name is required").isLength({min:2}).withMessage("Minimum 2 Character is required")
],categoryCtrl.InsertCategory);
routes.get('/viewCategory',categoryCtrl.viewCategory);
routes.get('/deleteCategory/:id',categoryCtrl.deleteCategory);

// hard delete / multiple delete 
routes.post("/deleteMultipleCategory",categoryCtrl.deleteMultipleCategory);

// active 
routes.get("/changeStatus",categoryCtrl.changeStatus);

// Deactive 
routes.get("/changeStatusTrue",categoryCtrl.changeStatusTrue);

module.exports=routes;