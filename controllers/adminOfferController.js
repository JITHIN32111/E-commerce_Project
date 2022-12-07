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

 
module.exports.viewProductOfferAdmin= async function(req,res){
 
    producthelpers.getproduct().then((product)=>{
    res.render('admin/product-offer',{admin:true,product})
    
    })
      
    }

 
module.exports.productOfferDetails=async function(req,res){
    producthelpers.setOffer(req.body)
    res.json({status:true})
    }


module.exports.deleteOfferAdmin=(req,res)=>{
    let proId=req.params.id
    producthelpers.deleteoffer(proId).then((response)=>{
    res.json({status:true})
    })
    }



module.exports.viewAllcoupenAdmin=async function(req,res){
    //  await producthelpers.checkCoupen()
  let coupen=await producthelpers.getCoupenDetails()
    

  res.render('admin/viewCoupen',{admin:true,coupen})
    
   }



module.exports.addCoupenDetails=async function(req,res){
    producthelpers.addCoupen(req.body)
    res.redirect('/admin/view-coupen')
    }



module.exports.
deleteCoupenAdmin=(req,res)=>{
    console.log(":::::::::::::::::::::::::");
    console.log(req.params.id);
    let proId=req.params.id
    producthelpers.deletecoupen(proId).then((response)=>{
    res.json({status:true})
    })
    }