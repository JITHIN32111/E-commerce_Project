const usersHelpers = require('../helpers/user-helpers')

const categoryhelpers = require("../helpers/category-helpers");
const producthelpers = require("../helpers/product-helpers");

const paypal = require("paypal-rest-sdk");

let errormessage;
let err;
let gif;



module.exports.userhomepage= async function(req, res, next) {
  let cartCount=0
  if(req.session.user){
    
     cartCount=await usersHelpers.getCartCount(req.session.user._id)

  }

    let member=req.session.user

   producthelpers.getproduct().then((pro)=>{
    categoryhelpers.selectcategory().then((categories)=>{
      producthelpers.getBanner().then((banner)=>{
                res.render('index', {user:true,member,pro,categories,cartCount,icon:true,banner});

      })
    })
   
   })
    
 
}


module.exports.login=function(req, res, next) {
    
    if(req.session.loggedin ){
  
      res.redirect('/')
    }else{
       res.render('login', {"loginErr":req.session.loginErr });
      req.session.loginErr=false
  
    }
  }


  module.exports.signup=function(req, res, next) {
    res.render('signup',{errormessage});
    errormessage=""
  }


  module.exports.signupform=(req,res,next)=>{
   

    usersHelpers.dosignup(req.body).then((response)=>{
    console.log(response.message);
   
  if(response.status){
    errormessage = response.message
    res.redirect('/register')
  }
  else{
    res.redirect('/login')
  }
    })
  }

    module.exports.loginForm=(req,res,next)=>{
    usersHelpers.dologin(req.body).then((response) => {
      if (response.status && response.user.blockstatus) {
        req.session.loggedin = true;
        req.session.user = response.user;
        res.redirect("/");
      } else {
        loginErr = req.session.loginErr = true;
        res.redirect("/login");
      }
    });
  };
  module.exports.logout= (req, res) => {
    req.session.destroy();
    res.redirect("/");
  }