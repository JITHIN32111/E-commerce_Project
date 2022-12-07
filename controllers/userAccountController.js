const producthelpers = require("../helpers/product-helpers");

const refferalHelpers = require("../helpers/refferal-helpers");

const userHelpers = require("../helpers/user-helpers");



module.exports.viewOrderProducts= async (req, res) => {
    if(req.session.loggedin){
        let member = req.session.user;
    let products = await userHelpers.getOrderProducts(req.params.id);
    console.log("}}}}}}}");
    
    orderId=req.params.id
    console.log(orderId);
    
  
    
    let status = await userHelpers.getStatus(req.params.id);
       console.log("_________");
       console.log(products);
       let userId=req.session.user._id
       console.log(userId);
  
    res.render("view-order-products", { user: true, member, products, status,userId ,orderId});
    }else{
      res.redirect('/login')
    }
  
  }



module.exports.reviewProduct= async (req, res) => {
  
    let files=req.files
    console.log("%$%$%$");
    console.log(req.body);
    let fileName=files.map((file)=>{
    return file.filename
  })
   const product=req.body
   product.img=fileName
  producthelpers.addReview(req.body)
  res.redirect('/myAccount')
  }




module.exports.returnProduct= (req, res) => {
  
    console.log(req.body);
    oId=req.body.orderId
    pId=req.body.proId
     userHelpers.requestReturn(pId,oId,req.body)
     
    res.redirect('/myAccount')
    }




module.exports.passwordChange=(req, res) => {
    console.log("000000000000000000000000000000000000000000000000000000000000000000");
    console.log(req.body);
    
     userHelpers.changePassword(req.body).then((response)=>{
      console.log(response.message);
      res.redirect('/myAccount')
  
     })
     
    }




module.exports.userAccount=async (req, res) => {
    if (req.session.loggedin) {
      let member = req.session.user;
      let user = await userHelpers.getUser(req.session.user._id);
      let orders = await userHelpers.getUserData(req.session.user._id);
  
      let address = await userHelpers.getAddress(req.session.user._id);
      let wallet = await refferalHelpers.getWallet(req.session.user._id);
     amount= Math.ceil(wallet.balance)
      console.log(user);
      res.render("myaccount", {
        user: true,
        member,
        user,
        orders,
        address,
        wallet,
        amount
      });
    } else {
      res.redirect("/login");
    }
  }