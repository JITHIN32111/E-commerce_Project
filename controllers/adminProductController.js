var express = require('express');
var router = express.Router();
const usersHelpers = require('../helpers/user-helpers')
const producthelpers=require('../helpers/product-helpers');
const categoryhelpers = require('../helpers/category-helpers');


const credentials={name:'jithin@gmail.com',password:'12345'}
const{upload,upload2,upload3 }=require('../public/javascripts/fileupload');
const { json } = require('express');
const { LogContext } = require('twilio/lib/rest/serverless/v1/service/environment/log');
let error

module.exports.viewProductsAdmin=function(req,res){
    producthelpers.getproduct().then((product)=>{
    res.render('admin/viewproducts',{admin:true,product})
     })
     }


module.exports.addProducts=function(req,res){
    categoryhelpers.selectcategory().then((category)=>{
    res.render('admin/add-products',{admin:true,category})
    })
    }

module.exports.addProductsDetails=function(req,res){
   
    const files=req.files
    const fileName=files.map((file)=>{
    return file.filename
    })
     const product=req.body
     product.img=fileName
     producthelpers.insertproducts(req.body).then((response)=>{
     res.redirect('/admin/addproducts')
      // res.json(response)
    })
    }

module.exports.deleteproducts=(req,res)=>{
    let proId=req.params.id
    producthelpers.deleteproduct(proId).then((response)=>{
    res.json({status:true})
    })
    }

module.exports.editProducts=(req,res)=>{
    producthelpers.productdetails(req.params.id).then((product)=>{
    categoryhelpers.selectcategory().then((category)=>{
    res.render('admin/edit-product',{admin:true,product,category})
     })
     })
     }

     module.exports.editProductsDetail=(req,res)=>{

        let id=req.params.id
        producthelpers.productdetails(req.params.id).then((products)=>{
          if(req.files!=0){
            const files=req.files
            const fileName=files.map((file)=>{
            return file.filename
            
            })
            var product=req.body
            product.img=fileName 
          }
          else{
            var product=req.body
            product.img=products.img
          }
        
          producthelpers.updateproducts(req.params.id,req.body).then(()=>{
            res.redirect('/admin/viewproducts')
        
         })
         })
         }   