//add Blog
const Blog = require("../models/blogModel");
const path = require("path");
const fs = require("fs");
const category = require("../models/categoryModal");
const {validationResult}=require('express-validator');

module.exports.addBlog = async (req, res) => {
  try {
    const addCategory = await category.find();
    return res.render("blogs/addBlogs", {
      addCategory,
      errorData:[],
      old:[]
    });
  } catch (err) {
    console.log(err);
    res.redirect("back");
  }
};

module.exports.insertblog = async (req, res) => {
    try {
      const addCategory = await category.find();
      let error=validationResult(req);
      console.log(error.mapped());
      if(!error.isEmpty()){
        return res.render('blogs/addBlogs',{
          errorData:error.mapped(),
          old:req.body,
          addCategory
        })
      }
        req.body.status = true;
        let imagePath = "";
        if (req.file) {
            imagePath = (await Blog.imgPath) + "/" + req.file.filename;
        }
        req.body.image = imagePath;
        let blogData = await Blog.create(req.body);
        if (blogData) {
            let findCategory = await category.findById(req.body.categoryId);
            findCategory.blogId.push(blogData._id);
            await category.findByIdAndUpdate(req.body.categoryId,findCategory);
            console.log("blog data add successfully");
            return res.redirect("back");
        }
        else {
            console.log("data not found");
            return res.redirect("back");
        }
    }
    catch {
        console.log("something is wrong");
        return res.redirect("back")
    }
};

module.exports.viewBlogs = async (req, res) => {
  var search = "";
  if (req.query.blogSearch) {
    search = req.query.blogSearch;
  }

  let per_page = 2;
  let page = 0;

  if (req.query.page) {
    page = req.query.page;
  }

  // single field
  // let empData=await Blog.find({author:{$regex:search}}).populate('categoryId').exec();

  // multiple field
  let empData = await Blog.find({
    $or: [
      { title: { $regex: search } },
      
    ],
  })
    .skip(page * per_page)
    .limit(per_page)
    .populate("categoryId")
    .exec();

  let totalRecord = await Blog.find({
    $or: [
      { title: { $regex: search } },
      
    ],
  }).countDocuments();
  let totalCounts = Math.ceil(totalRecord / per_page);
  const addCategory = await category.find();
  return res.render("blogs/viewBlogs", {
    addCategory,
    empData,
    search,
    totalCounts,
    page,
    'no': (page==0)?0:(page*per_page)
  });
};

module.exports.deleteblog = async (req, res) => {
  let id = req.params.id;
  let singleblog = await Blog.findById(id);

  const deletePath = path.join(__dirname, "..", singleblog.image);

  try {
    if (deletePath) {
      fs.unlinkSync(deletePath);
      req.flash('error',"blog delete successfully");
    }
  } catch {
    console.log("image is not found");
  }
  await Blog.findByIdAndDelete(id);
  return res.redirect("back");
};

module.exports.updateblog = async (req, res) => {
  let id = req.query.blogid;

  let singleobj = await Blog.findById(id);
  const addCategory = await category.find();
  return res.render("blogs/updateBlogs", {
    singleobj,
    addCategory
  });
};

module.exports.editBlog = async (req, res) => {
  if (req.file) {
    let singleData = await Blog.findById(req.body.bid);
console.log(req.body.bid);

    try {
      let oldImage = path.join(__dirname, "..", singleData.image);
      req.body.image = oldImage;
      fs.unlinkSync(oldImage);
    } catch {
      console.log("image is not found");
    }

    // new

    let newImagePath = (await Blog.imgPath) + "/" + req.file.filename;
    req.body.image = newImagePath;
    await Blog.findByIdAndUpdate(req.body.bid, req.body);
    req.flash('warning',"Blogs update successfully");
    return res.redirect("/blogs/viewBlogs");
  } else {
    let singleData = await Blog.findById(req.body.bid);
    req.body.image = singleData.image;
    await Blog.findByIdAndUpdate(req.body.bid, req.body);
    req.flash('warning',"Blogs update successfully");
    return res.redirect("/blogs/viewBlogs");
  }
};

//active
module.exports.activeStatus=async(req,res)=>{
  try{
    console.log(req.query);
    let blogStatusUpdate=await Blog.findByIdAndUpdate(req.query.blogId,{'status':false});
    if(blogStatusUpdate){
      console.log("Deactive successully");
      req.flash('warning',"blog deactive successfully");
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

//deactive
module.exports.activeStatusTrue=async(req,res)=>{
  try{
    console.log(req.query);
    let blogStatusUpdate=await Blog.findByIdAndUpdate(req.query.blogId,{'status':true});
    if(blogStatusUpdate){
      // console.log("Active successully");
      req.flash('success',"blog active successfully");
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
