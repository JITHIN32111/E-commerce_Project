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

module.exports.viewBannersAdmin=async function(req,res){
    let banner=await producthelpers.getBanner()
    
      res.render('admin/viewbanners',{admin:true,banner})
    }



module.exports.addBanner=function(req,res){
 
    res.render('admin/addbanners',{admin:true})
  }




module.exports.addBannerDetails=function(req,res){
    const banners=req.body
    banners.img=req.files[0].filename
    producthelpers.addBanner(req.body)
    res.redirect('/admin/addbanners')
    }



module.exports.editBanner=function(req,res){
    categoryhelpers.bannerdetails(req.params.id).then((category)=>{
     
      res.render('admin/edit-banner',{admin:true,category})
   })
      
   
  }


module.exports.editBannerDetials=(req,res)=>{
    let id=req.params.id
    categoryhelpers.bannerdetails(req.params.id).then((category)=>{
     let categorydetails = req.body
     if(req.files !=0){
     categorydetails.img=req.files[0].filename
     }
     else{
     categorydetails.img=category.img
     }
     categoryhelpers.updatebanner(req.params.id,categorydetails).then(()=>{
      res.redirect('/admin/viewbanners')
     })
     })
   
     }

     module.exports.deleteBanner=function(req,res){
        catid=req.params.id
        producthelpers.deletebanner(catid).then(()=>{
          res.json({status:true})
            // res.redirect('/admin/viewcategory')
        })
    
    }