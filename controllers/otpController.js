const dotenv = require('dotenv').config();
const usersHelpers = require('../helpers/user-helpers')

const { Client }=require('twilio/lib/twiml/VoiceResponse')
const otp = require('../confi/otp');
let client = require("twilio")( process.env.twillio_accountSID, process.env.twillio_authToken);



let errormessage;
let err;
let gif;
 

module.exports.enterNumber= (req, res) => {
    res.render("number", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
  module.exports.otpSend=(req, res) => {
    usersHelpers.otpsend(req.body).then((response) => {
      if (response.status && response.user.blockstatus) {
        let phonenumber = parseInt(response.user.phonenumber);
        req.session.phonenumber = phonenumber;
        req.session.loggedin = true;
        req.session.user = response.user;
        client.verify
          .services(otp.serviceID) // Change service ID
          .verifications.create({
            to: `+91${phonenumber}`,
            channel: "sms",
          })
          .then((response) => {})
          .catch((err) => {});
        res.redirect("/otp");
      } else {
        req.session.loginErr = true;
        res.redirect("/number");
      }
    });
  }

  module.exports.enterOtp= (req, res) => {
    res.render("otp", { otperr: req.session.otperr });
    req.session.otp = "";
  }
  module.exports.otpVerify= (req, res) => {
    client.verify
      .services(otp.serviceID) // Change service ID
      .verificationChecks.create({
        to: `+91${req.session.phonenumber}`,
        code: req.body.code,
      })
      .then((data) => {
       
  
        if (data.status === "approved") {
          if (req.session.loggedin) {
            res.redirect("/");
          } else {
            res.render("login", { loginErr: req.session.loginErr });
            req.session.loginErr = false;
          }
        } else {
          req.session.otperr = "Invalid Otp";
          let otperr = req.session.otperr;
          res.redirect("/otp");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
