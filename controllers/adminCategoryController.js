var express = require('express');
var router = express.Router();
const usersHelpers = require('../helpers/user-helpers')
const producthelpers=require('../helpers/product-helpers');
const categoryhelpers = require('../helpers/category-helpers');

const { response } = require('../app');

const credentials={name:'jithin@gmail.com',password:'12345'}
const{upload,upload2,upload3 }=require('../public/javascripts/fileupload');
const { json } = require('express');
const { LogContext } = require('twilio/lib/rest/serverless/v1/service/environment/log');
let error


module.exports.addCategory=function(req,res){
    
    res.render('admin/addcategory',{admin:true,error})
    error=""
  }


module.exports.addCategoryDetails=function(req,res){
    const category=req.body
    category.img=req.files[0].filename
    categoryhelpers.checkcategory(req.body).then((response)=>{
      if(response.status){
      error= response.message
      res.redirect('/admin/addcategory')
       }
       else{
      res.redirect('/admin/addcategory')
           }
      })
      }


module.exports.editCategory=function(req,res){
    categoryhelpers.categorydetails(req.params.id).then((category)=>{
     
      res.render('admin/edit-category',{admin:true,category})
   })
      
   
  }


module.exports.editCategoryDetails=(req,res)=>{
    let id=req.params.id
    categoryhelpers.categorydetails(req.params.id).then((category)=>{
     let categorydetails = req.body
     if(req.files !=0){
     categorydetails.img=req.files[0].filename
     }
     else{
     categorydetails.img=category.img
     }
     categoryhelpers.updatecategory(req.params.id,categorydetails).then(()=>{
      res.redirect('/admin/viewcategory')
     })
     })
   
     }

     module.exports.adminDeleteCategory=function(req,res){
        catid=req.params.id
        categoryhelpers.deletecategory(catid).then(()=>{
          res.json({status:true})
            // res.redirect('/admin/viewcategory')
        })
    
    }

    module.exports.viewCategoryAdmin=function(req,res){
        categoryhelpers.getcategory().then((category)=>{
        res.render('admin/viewcategory',{admin:true,category})
      })
      
      }

