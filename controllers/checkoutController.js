const usersHelpers = require("../helpers/user-helpers");
const producthelpers = require("../helpers/product-helpers");
// 

const refferalHelpers = require("../helpers/refferal-helpers");
const userHelpers = require("../helpers/user-helpers");


const paypal = require("paypal-rest-sdk");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
  process.env.paypal_client_id,
  client_secret:
   process.env.paypal_client_secret
});
const { log } = require("handlebars");


let errormessage;
let err;
let gif;



module.exports.addressPage=async (req, res) => {
    res.render("address", { user: true });
  }

module.exports.submitAddress=async (req, res) => {
    if (req.session.loggedin) {
      userHelpers.addressSubmit(req.body, req.session.user._id);
      res.redirect("/checkout");
    } else {
      res.redirect("/login");
    }
  }

module.exports.checkoutPage=async (req, res) => {
    if (req.session.loggedin) {
      let member = req.session.user;
      let total = await usersHelpers.getTotalAmount(req.session.user._id);
      let products = await usersHelpers.getCartProducts(req.session.user._id);
      let address = await usersHelpers.getAddress(req.session.user._id)
      let coupen = await producthelpers.getCoupenDetails(req.session.user._id);
      let Wallet = await refferalHelpers.getWalletAmount(req.session.user._id);
         

      console.log(Wallet.balance);
      amount = Wallet.balance;
  
      res.render("checkout", {
        user: true,
        total,
        user: req.session.user,
        member,
        products,
        address,
        coupen,
        amount,
      });
    } else {
      res.redirect("/login");
    }
  }  
  module.exports.OrderPlace=async (req, res) => {
  console.log("%%%%%%%%%%%%%%%%%%")
   console.log(req.body);
          if (req.session.loggedin) {
          let products=await userHelpers.getCartProductDetails(req.body.userId)
      console.log("?????");
      console.log(products);
          userHelpers.addId(req.body.coupenName, req.body.userId);
           
      
  
      if (req.body.newTotal > 1) {

      

         
        totalPrice = parseFloat(req.body.newTotal);
      } else {
        totalPrice = await userHelpers.getTotalAmount(req.body.userId);
      }
  
      userHelpers.placeOrder(req.body, products, totalPrice).then((orderId) => {
        console.log("dddddd");
        if (req.body["payment-method"] === "Wallet") {
          refferalHelpers.FromWallet(req.body.userId, totalPrice);
          res.json({ wallet: true });
        } else if (req.body["payment-method"] === "COD") {
          console.log("dddddd");
          res.json({ codSuccess: true });
        } else if (req.body["payment-method"] === "paypal") {
          userHelpers.generatePaypal(orderId, totalPrice).then((link) => {
            console.log(link);
            res.json(link);
          });
        } else {
          console.log("dddddd");
          userHelpers.generateRazorpay(orderId, totalPrice).then((response) => {
            res.json(response);
          });
        }
      });
    } else {
      res.redirect("/login");
    }
  }

module.exports.paypalPayement=(req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "25.00",
          },
        },
      ],
    };
  
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log(JSON.stringify(payment));
  
  
          res.redirect("/order-success");
  
        }
      }
    );
  }  

  module.exports.verifyOnlinePayment=(req, res) => {
    userHelpers
      .verifyPayment(req.body)
      .then(() => {
        userHelpers
          .changePaymentStatus(req.body["order[receipt]"])
          .then(() => {
            console.log("payment successfull");
            res.json({ status: true });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: false, errMsg: "" });
      });
  }


  module.exports.orderSuccess=(req, res) => {
    res.render("order-success", { user: true });
  }

  module.exports.userCoupen=async(req, res) => {
    if (req.session.loggedin) {
      producthelpers
        .findCoupen(req.body, req.session.user._id)
        .then((response) => {
          if (response) {
            res.json(response);
          } else if (response == "used") {
            res.json({ status: false });
          } else {
            res.json({ status: true });
          }
        });
  
  
    } else {
      res.redirect("/login");
    }
  }

  module.exports.getCoupen= async function(req,res){
    cid=req.params.coupenId
    cpn=await producthelpers.fetchCoupen(cid)
    
  
    res.json(cpn)
   
    
    }