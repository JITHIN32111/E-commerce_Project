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

const {
  adminDahboard,adminLogin,indexPage,adminLogout
 } = require("../controllers/adminDashboardController");

 const {
  viewAllUsers,blockUser,unblockUser
 } = require("../controllers/adminUserController");

 const {
  viewProductsAdmin,addProducts,addProductsDetails,deleteproducts,editProducts,editProductsDetail
 } = require("../controllers/adminProductController");

 const { 
  addCategory,addCategoryDetails,editCategory,editCategoryDetails,adminDeleteCategory,viewCategoryAdmin
 } = require("../controllers/adminCategoryController");

 const { 
  viewBannersAdmin,addBanner,addBannerDetails,editBanner,editBannerDetials,deleteBanner
 } = require("../controllers/adminBannerController");
 const { 
  viewOrdersAdmin,viewOrderProductsAdmin,returnDetails,cancelOrder,dispatchOrder,deliveredOrderAdmin,shippedOrderAdmin,viewSalesReportAdmin
 } = require("../controllers/adminOrderController");

 const { 
  viewProductOfferAdmin,productOfferDetails,deleteOfferAdmin,viewAllcoupenAdmin,addCoupenDetails,deleteCoupenAdmin
 } = require("../controllers/adminOfferController");

const { deleteproduct } = require('../helpers/product-helpers');
const { viewOrderProducts } = require('../controllers/userAccountController');
const { deliveredOrder } = require('../helpers/user-helpers');

// router.get('/hai',function(req,res){
//   res.render('/signnn')
//   })

router.get('/',adminDahboard);



router.post('/login',adminLogin);



router.get('/index',indexPage)

router.get('/signout',adminLogout)


// ___________________________________________________adminDashboard_____________________________________________________


router.get('/viewusers',viewAllUsers)

router.get('/block-user/:id',blockUser)

router.get('/unblock-user/:id',unblockUser)


// __________________________________________________userManagement____________________________________________________________


router.get('/viewproducts',viewProductsAdmin)

router.get('/addproducts',addProducts)

router.post('/add-product',upload.array('image'),addProductsDetails)

router.get('/delete-product/:id',deleteproducts)


router.get('/edit-product/:id',editProducts)


router.post('/edit-product/:id',upload.array('images'),editProductsDetail)


// _______________________________________________________productManagement________________________________________________


router.get('/viewcategory',viewCategoryAdmin)

router.get('/addcategory',addCategory)


router.post('/add-category',upload2.array('image'),addCategoryDetails)


router.get('/edit-category/:id',editCategory)





router.post('/edit-category/:id',upload2.any('image'),editCategoryDetails)


router.get('/delete-category/:id',adminDeleteCategory) 



// _________________________________________________________categoryManagement___________________________________________________

router.get('/viewbanners',viewBannersAdmin)

router.get('/addbanners',addBanner)



router.post('/add-banner',upload3.array('image'),addBannerDetails)


router.get('/edit-banner/:id',editBanner)


router.post('/edit-banner/:id',upload3.any('image'),editBannerDetials)


router.get('/delete-banner/:id',deleteBanner)


// __________________________________________________bannerManagement______________________________________________________


router.get('/view-orders',viewOrdersAdmin)



router.get('/view-product/:id',viewOrderProductsAdmin)


router.post("/returnApprove-details",returnDetails);


router.put('/cancel-Ordder/:id/:proId/:qnty',cancelOrder)

router.put('/dispatch-Ordder/:id/:proId',dispatchOrder)

 router.put('/delivered-Ordder/:id/:proId',deliveredOrderAdmin)


 router.put('/shipped-Ordder/:id/:proId',shippedOrderAdmin)


 router.get('/view-salesReport',viewSalesReportAdmin)



//  ______________________________________________orderManagement___________________________________________________

router.get('/view-productOffer',viewProductOfferAdmin)


router.post('/product-offer',productOfferDetails)


router.get('/delete-offer/:id',deleteOfferAdmin)


router.get('/view-coupen',viewAllcoupenAdmin)


router.post('/add-coupen',addCoupenDetails)

router.get('/delete-coupen/:id',deleteCoupenAdmin)





module.exports = router;
