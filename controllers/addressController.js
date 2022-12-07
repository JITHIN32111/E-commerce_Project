
const { log } = require("handlebars");
const userHelpers = require("../helpers/user-helpers");

const{upload4}=require('../public/javascripts/fileupload');


module.exports.editUserDetails= async (req, res) => {
    if (req.session.loggedin) {
      userHelpers.updateUser(req.body, req.session.user._id);
      res.redirect("/myAccount");
    } else {
      res.redirect("/login");
    }
  }




module.exports.editAddress=async (req, res) => {
    userHelpers.getuserAddress(req.params.id).then((address) => {
      let member = req.session.user;
      res.render("edit-address", { user: true, member, address });
    });
  }



module.exports.editAddressDetails=(req, res) => {
    userHelpers.editAddress(req.body, req.params.id);
    res.redirect("/myAccount");
  }

  module.exports.deleteAddress=(req, res) => {
    let addressId = req.params.id;
    userHelpers.deleteAddress(addressId).then((response) => {
      res.json({ status: true });
    });
  }
