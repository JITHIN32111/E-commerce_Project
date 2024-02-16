var express = require('express');
var router = express.Router();
const usersHelpers = require('../helpers/user-helpers')
const producthelpers=require('../helpers/product-helpers');


const credentials={name:'jithin@gmail.com',password:'12345'}
const { json } = require('express');
const { LogContext } = require('twilio/lib/rest/serverless/v1/service/environment/log');
let erro

module.exports.viewAllUsers=function(req,res){

    producthelpers.getallusers().then((users)=>{
    
    res.render('admin/viewusers',{admin:true,users})
      })
      }


module.exports.blockUser=(req,res)=>{
    usersHelpers.blockuser(req.params.id,req.body).then((response)=>{
    res.redirect('/admin/viewusers')
     // res.json(response)
 
 
   })
 }


module.exports.unblockUser=(req,res)=>{
    usersHelpers.unblockuser(req.params.id,req.body).then(()=>{
    res.redirect('/admin/viewusers')


  })
}