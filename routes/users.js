var express = require("express");
var router = express.Router();
const usersHelpers = require("../helpers/user-helpers");
const producthelpers = require("../helpers/product-helpers");
const { response } = require("express");
/* GET home page. */
const {
  userhomepage,
  login,
  signup,
  signupform,
  loginForm,
  logout
} = require("../controllers/usercontroller");
const {
 cartPage,addToCart,productQuantity,removeProduct
} = require("../controllers/cartController");
const {
  enterNumber,otpSend,enterOtp,otpVerify
 } = require("../controllers/otpController");

 const {
  addressPage,submitAddress, checkoutPage,OrderPlace,paypalPayement,verifyOnlinePayment,orderSuccess,userCoupen,getCoupen
 } = require("../controllers/checkoutController");
 const {
  viewAllProducts,viewFilterProducts,productSearch,showProducts,showCategoryProducts
 } = require("../controllers/productController");
 const {
  viewOrderProducts,reviewProduct,returnProduct,passwordChange,userAccount
 } = require("../controllers/userAccountController");

 const {
  editUserDetails,editAddress,editAddressDetails,deleteAddress
 } = require("../controllers/addressController");


const categoryHelpers = require("../helpers/category-helpers");
const refferalHelpers = require("../helpers/refferal-helpers");

const { Client } = require("twilio/lib/twiml/VoiceResponse");
const otp = require("../confi/otp");
const { validateRequestWithBody } = require("twilio/lib/webhooks/webhooks");
const session = require("express-session");
const userHelpers = require("../helpers/user-helpers");
let client = require("twilio")(otp.accountSID, otp.authToken);
const paypal = require("paypal-rest-sdk");
var code = require("voucher-code-generator");
const { changeProductQuantity, placeOrder, verifyPayment, changePassword } = require("../helpers/user-helpers");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "Acksa7afffP0G-Bd5fI0TK-5JSwN2gIUtteYdkOj0JdjYMuGv7Z9_mdIEYVZIloPt_2sY8ooQ2CSvFna",
  client_secret:
    "EBPteQikI8zJ6FLL3r-HFvHm8Qzc5wYcwxkmuVeqKoRgdVV0CrU5im6ZC-lZynN_hxOZNN7sMuiO0rca",
});

const{upload4}=require('../public/javascripts/fileupload');
const { Db } = require("mongodb");

let errormessage;
let err;
let gif;

router.get("/", userhomepage);

router.get("/login", login);

router.get("/register", signup);



router.post("/submit", signupform);

router.post("/login",loginForm )

router.get("/logout",logout)


// ____________________________________userhome/-login/signup________________________________________________________

router.get("/viewAllProducts/", viewAllProducts);

router.post("/filterProducts", viewFilterProducts);

router.post("/search",productSearch);



router.get("/product/:id",showProducts)

router.get("/category/:name", showCategoryProducts)


// _____________________________________________products___________________________________________________________________

router.get("/carts",cartPage);

router.get("/cart/:id",addToCart )

router.post("/change-product-quantity",productQuantity )

router.post("/remove-Product-Cart",removeProduct);




//_______________________________________________cart_______________________________________________________





router.get("/number",enterNumber)

router.get("/otp",enterOtp)

router.post("/send",otpSend);

router.post("/otp",otpVerify)


//_____________________________________otp______________________________________________________________________________-



router.get("/address",addressPage );


router.post("/addressSubmit",submitAddress) ;

router.get("/checkout", checkoutPage)

router.post("/place-order",OrderPlace) ;

router.get("/success",paypalPayement);

router.post("/verify-payment",verifyOnlinePayment);

router.get("/order-success",orderSuccess);

router.post("/coupen",userCoupen);

router.get('/getCouponCode/:coupenId',getCoupen)

// ______________________________________________checkout_____________________________________________________________




router.get("/view-order-products/:id",viewOrderProducts);
// router.get("/return",  (req, res) => {
//   let member = req.session.user;

//  res.render("add-return", { user: true, member});
 
// });


router.post("/review-details",upload4.array('image'),reviewProduct);

router.post("/return-details",returnProduct);



router.post("/password-details",passwordChange);

router.get("/myAccount",userAccount);

// ___________________________________________________userAccount_____________________________________________



router.post("/edit-details",editUserDetails);


router.get("/edit-address/:id",editAddress);


router.post("/editAddress/:id",editAddressDetails);


router.delete("/delete-address/:id",deleteAddress);


// _______________________________________Address_____________________________________________________



module.exports = router;
