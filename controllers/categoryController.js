//add category
const category = require("../models/categoryModal");
const {validationResult}=require('express-validator');

module.exports.addCategory = async (req, res) => {
  try {
    res.render("category/addCategory",{
      errorData:[],
      old:[]
    });
  } catch (err) {
    console.log("Something is wrong...");
    return res.redirect("back");
  }
};
module.exports.InsertCategory = async (req, res) => {
  try {
    let error=validationResult(req);
    console.log(error);
    const categoryData = await category.create(req.body);
    if(!error.isEmpty()){
      return res.render('category/addCategory',{
        errorData:error.mapped(),
        old:req.body
      })
    }


    req.flash('success',"Category Add Successfully");
    return res.redirect("back");
  } catch (err) {
    console.log("something is wrong");
    return res.redirect("back");
  }
};
module.exports.viewCategory = async (req, res) => {
  try {
    var search = "";
    if (req.query.categorySearch) {
      search = req.query.categorySearch;
    }

    let per_page = 3;
    let page = 0;

    if (req.query.page) {
      page = req.query.page;
    }

    // multiple field
    let view_category = await category.find({
        $or: [{ categoryName: { $regex: search } }],
      })
      .skip(page * per_page)
      .limit(per_page);

    let totalRecords = await category.find({
        $or: [{ categoryName: { $regex: search } }],
      })
      .countDocuments();
    let totalCount = Math.ceil(totalRecords / per_page);
    console.log(totalCount);
    var no = (page==0)?0:(page*per_page);

    return res.render("category/viewCategory", {
      view_category,
      search,
      totalCount,
      page,
      no
    });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

module.exports.deleteCategory = async (req, res) => {
  try{
    await category.findByIdAndDelete( req.params.id);
    req.flash('error',"Category delete successfully");
    return res.redirect("back");
  }
  catch(err){
    console.log(err);
    return res.redirect('back');  
  }
};

//hard delete / multiple delete

module.exports.deleteMultipleCategory = async (req, res) => {
  try{
    console.log(req.body.Ids);
    let categoryDelete=await category.deleteMany({_id:{$in:req.body.Ids}});
    if(categoryDelete){
      // console.log("All Data delete successfully...");
      req.flash('error',"All Category delete successfully");
      return res.redirect('back');
    }
    else{
      console.log(err);
      return res.redirect('back');
    }
  }
  catch(err){
    console.log(err);
    return res.redirect('back');  
  }
};

// active 

module.exports.changeStatus=async(req,res)=>{
  try{
    console.log(req.query);
    let catStatusUpdate=await category.findByIdAndUpdate(req.query.catId,{'status':false});
    if(catStatusUpdate){
      console.log("Deactive successully");
      req.flash('warning',"Category deactive successfully");
      return res.redirect('back');
    }
    else{
      console.log(err);
      return res.redirect('back');
    }
  }
  catch(err){
    console.log(err);
    return res.redirect('back');
  }
}

// Deactive 

module.exports.changeStatusTrue=async(req,res)=>{
  try{
    console.log(req.query);
    let catStatusUpdate=await category.findByIdAndUpdate(req.query.catId,{'status':true});
    if(catStatusUpdate){
      // console.log("Active successully");
      req.flash('success',"Category active successfully");
      return res.redirect('back');
    }
    else{
      console.log(err);
      return res.redirect('back');
    }
  }
  catch(err){
    console.log(err);
    return res.redirect('back');
  }
}
