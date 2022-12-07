const usersHelpers = require('../helpers/user-helpers')

const producthelpers = require("../helpers/product-helpers");


let errormessage;
let err;
let gif;






  module.exports.cartPage=async (req, res) => {
    if (req.session.loggedin) {
      let member = req.session.user;
      let products = await usersHelpers.getCartProducts(req.session.user._id);
  
      let total = await usersHelpers.getTotalAmount(req.session.user._id);
      if (total) {
        res.render("cart", {
          user: true,
          member,
          user: req.session.user._id,
          products,
          total,
        });
      } else {
        res.render("some", { user: true, member });
      }
    } else {
      res.redirect("/");
    }
  }
  module.exports.addToCart=(req, res) => {
    let member = req.session.user;
  
    if (req.session.loggedin) {
     
  
      usersHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
        res.json({ status: true });
      });
    } else {
      res.json({ status: false });
    }
  }
  module.exports.productQuantity=(req, res, next) => {
    usersHelpers.changeProductQuantity(req.body).then(async (response) => {
      response.total = await usersHelpers.getTotalAmount(req.body.user);
      // response.stock= await userHelpers.getStock(req.body)
  
      res.json(response);
    });
  }
  module.exports.removeProduct= (req, res, next) => {
    usersHelpers.romoveProductcart(req.body).then((response) => {
      res.json(response);
    });
  }
