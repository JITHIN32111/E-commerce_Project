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

module.exports.adminDahboard=async function (req, res, next) {
    if(req.session.adminLogins){
      let dailySales=await usersHelpers.dailySalesReport()
      let monthlySales=await usersHelpers.monthlySalesReport()
      let yearlySales=await usersHelpers.yearlySalesReport()
      let topSelling=await usersHelpers.topSellingProducts()
      let recentSales=await usersHelpers.recentsales()
    
      
    
      customers=await usersHelpers.getUserCount()
      revenue=await usersHelpers.getRevenue()
      total=revenue[0].total
      
    res.render('admin/index',{admin:true,dailySales,monthlySales,yearlySales,topSelling,customers,recentSales,total});
    }
    else{
        loginErr=req.session.loginErr
        res.render('admin/adminlogin',{loginErr})
        req.session.loginErr=false;
      }
     }

     module.exports.adminLogin=  function(req, res, next) {
        if(credentials.name==req.body.userName && credentials.password==req.body.password){
        req.session.adminLogins=true;
        res.redirect('/admin');
        }
        else{
        req.session.loginErr=true;
        res.redirect('/admin')
         }
        }


        module.exports.indexPage=function(req,res){
            res.redirect('/admin')
            }

      
   module.exports.adminLogout=function(req,res){
                req.session.adminLogins=false
                res.render('admin/adminlogin')
              }
