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


module.exports.viewOrdersAdmin=(req,res)=>{
    usersHelpers.getAllOrders().then((orders)=>{
    res.render('admin/view-orders',{admin:true,orders})
     })
    }


module.exports.viewOrderProductsAdmin=async(req,res)=>{
  
    let pro=await usersHelpers.getAllproductDetails(req.params.id)
   res.render('admin/viewdetails',{admin:true,pro})
   
   }



module.exports.returnDetails= (req, res) => {
  
    oId=req.body.orderId
    pId=req.body.proId
  
  
     usersHelpers.returnApproved(pId,oId)
   
       res.redirect('/admin/view-orders')
      // res.json({status:true})
  
  }



module.exports.cancelOrder=async(req,res)=>{

    let product=await producthelpers.ProductDetails(req.params.id)
   
    usersHelpers.cancelOrder(req.params.id,product,req.params.proId,req.params.qnty).then((response)=>{
    res.json({response})
    })
   }



module.exports.dispatchOrder=(req,res)=>{
    usersHelpers.dispatchOrder(req.params.id,req.params.proId).then((response)=>{
    res.json({response})
    })
   }



module.exports.deliveredOrderAdmin=(req,res)=>{
    usersHelpers.deliveredOrder(req.params.id,req.params.proId).then((response)=>{
    res.json({response})
    })
   }


module.exports.shippedOrderAdmin=(req,res)=>{
    usersHelpers.shippedOrder(req.params.id,req.params.proId).then((response)=>{
    res.json({response})
    })
   }


   module.exports.viewSalesReportAdmin= async function(req,res){
    let dailySales=await usersHelpers.dailySalesReport()
    let monthlySales=await usersHelpers.monthlySalesReport()
    let yearlySales=await usersHelpers.yearlySalesReport()
  
    res.render('admin/sales-report',{admin:true,dailySales,monthlySales,yearlySales})
    
  }
