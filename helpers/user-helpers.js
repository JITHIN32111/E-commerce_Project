var db = require("../confi/connection");

var collection = require("../confi/collections");
const bcrypt = require("bcrypt");
const MongoClient=require('../confi/connection')
const { response } = require("../app");
const ObjectID = require("mongodb").ObjectId;
const Razorpay = require("razorpay");
const refferalHelpers = require("../helpers/refferal-helpers");
const dotenv = require('dotenv').config();
var instance = new Razorpay({
  key_id:process.env.razorpay_key_id,
  key_secret:process.env.razorpay_key_secret,
});

const paypal = require("paypal-rest-sdk");
const { resolve } = require("path");
var code = require("voucher-code-generator");
const {
  IpAccessControlListList,
} = require("twilio/lib/rest/trunking/v1/trunk/ipAccessControlList");


paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
  process.env.paypal_client_id,
  client_secret:
   process.env.paypal_client_secret
});


module.exports = {
      dosignup: (userData) => {
      return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .count({ email: userData.email });
      if (user != 0) {
        response.user = user;
        response.status = true;
        response.message = "Email already exist";

        resolve(response);
      } else {
        if (userData.refferal){
             refferal = await db
            .get()
            .collection(collection.USER_COLLECTION)
            .findOne({ refferals: userData.refferal });

          if (refferal) {
                let amount = parseInt(100);
                refferalHelpers.
                refferalAmount(refferal, amount);

                refferal = code.generate({
                length: 5,
                 count: 4,
                charset: code.charset("alphabetic"),
                });

            userData.password = await bcrypt.hash(userData.password, 10);
            var date = new Date();

            var month = date.getUTCMonth() + 1; //months from 1-12
            var day = date.getUTCDate();
            var year = date.getUTCFullYear();
            userData.blockstatus = true;

             userData.newdate = year + "/" + month + "/" + day;
             userData.refferals = refferal[0];

            db.get()
               .collection(collection.USER_COLLECTION)
               .insertOne(userData)
               .then((hash) => {
               refferalHelpers.addWallet(hash.insertedId);
               refferalHelpers.addAmount(hash.insertedId);
                resolve(hash);
                console.log(hash);
              });


          }
          
          
          else {
             response.message = "refferal errror";

             resolve(response);
          }
        }
        
        else {
           refferal = code.generate({
            length: 5,
            count: 4,
            charset: code.charset("alphabetic"),
          });

          userData.password = await bcrypt.hash(userData.password, 10);
          var date = new Date();

          var month = date.getUTCMonth() + 1; //months from 1-12
          var day = date.getUTCDate();
          var year = date.getUTCFullYear();
          userData.blockstatus = true;
          userData.newdate = year + "/" + month + "/" + day;
          userData.refferals = refferal[0];

          db.get()
            .collection(collection.USER_COLLECTION)
            .insertOne(userData)
            .then((hash) => {
             resolve(hash);
              // console.log(hash);
            });
        }

        response.status = false;
        response.message = "";
      }
    });
  },
  dologin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });

      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            console.log("suc");
            response.user = user;
            response.status = true;

            resolve(response);
          } else {
            console.log("fai");
            resolve({ status: false });
          }
        });
      } else {
        console.log("nothong");
        resolve({ status: false });
      }
    });
  },
  blockuser: (productid, productdetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { _id: ObjectID(productid) },
          {
            $set: {
              blockstatus: false,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  unblockuser: (productid, productdetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { _id: ObjectID(productid) },
          {
            $set: {
              blockstatus: true,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  otpsend: (otp) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ phonenumber: otp.phonenumber });
      if (user) {
        response.user = user;
        response.status = true;

        resolve(response);
      } else {
        resolve({ status: false });
      }
    });
  },

  addToCart: (proId, userId) => {
    let proObj = {
      item: ObjectID(proId),
      quantity: 1,
    };
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: ObjectID(userId) });

      if (userCart) {
        let proExist = userCart.products.findIndex(
          (product) => product.item == proId
        );
        if (proExist != -1) {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { user: ObjectID(userId), "products.item": ObjectID(proId) },
              {
                $inc: { "products.$.quantity": 1 },
              }
            )
            .then(() => {
              resolve();
            });
        } else {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { user: ObjectID(userId) },
              {
                $push: { products: proObj },
              }
            )
            .then((response) => {
              resolve(response);
            });
        }
      } else {
        let cartObj = {
          user: ObjectID(userId),
          products: [proObj],
        };
        db.get()
          .collection(collection.CART_COLLECTION)
          .insertOne(cartObj)
          .then((response) => {
            resolve(response);
          });
      }
    });
  },

  getCartProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cartItems = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: ObjectID(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();

      resolve(cartItems);
    });
  },
  getCartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: ObjectID(userId) });

      if (cart) {
        count = cart.products.length;
      }
      resolve(count);
    });
  },
  changeProductQuantity: (details) => {
    details.count = parseInt(details.count);
    details.quantity = parseInt(details.quantity);
    return new Promise((resolve, reject) => {
      if (details.count == -1 && details.quantity == 1) {
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            { _id: ObjectID(details.cart) },
            {
              $pull: { products: { item: ObjectID(details.product) } },
            }
          )
          .then((response) => {
            resolve({ removeProduct: true });
          });
      } else {
        db.get()
          .collection(collection.CART_COLLECTION)
          .updateOne(
            {
              _id: ObjectID(details.cart),
              "products.item": ObjectID(details.product),
            },
            {
              $inc: { "products.$.quantity": details.count },
            }
          )
          .then((response) => {
            resolve({ status: true });
          });
      }
    });
  },
  romoveProductcart: (details) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          { _id: ObjectID(details.cart) },
          {
            $pull: { products: { item: ObjectID(details.product) } },
          }
        )
        .then((response) => {
          resolve({ removeProduct: true });
        });
    });
  },
  getTotalAmount: (userId) => {
    userId = ObjectID(userId);
    return new Promise(async (resolve, reject) => {
      let total = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: ObjectID(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$quantity", "$product.price"] } },
            },
          },
        ])
        .toArray();
      if (total[0]) {
        resolve(total[0].total);
      } else {
        total = 0;
        resolve(total);
      }

      // db.get().collection(collection.COUPEN_COLLECTION).updateOne({},{$push:{users:'userId'}}).then((response)=>{
      //   resolve(response)
      // })
    });
  },
  placeOrder: (order, products, total) => {
    return new Promise(async (resolve, reject) => {
      let status = order["payment-method"] === "COD" ? "placed" : "pending";

      var date = new Date();

      var month = date.getUTCMonth() + 1; //months from 1-12
      var day = date.getUTCDate();
      var year = date.getUTCFullYear();

      let address = await db
        .get()
        .collection(collection.ADDRESS_COLLECTION)
        .findOne({ _id: ObjectID(order.addressId) });
      newdate = year + "/" + month + "/" + day;
      let orderObj = {
        deliveryDetails: {
          firstname: address.firstname,
          lastname: address.lastname,
          company: address.companyname,
          country: address.country,
          state: address.stateaddress,
          town: address.towncity,
          state: address.statecounty,
          post: address.postcode,
          phone: address.phonenumber,
          email: address.email,
        },
        userId: ObjectID(order.userId),
        paymentMethod: order["payment-method"],
        products: products,
        totalAmount: total,
        newTotal: parseInt(order.ogTotal),
        applyedPrice:parseInt(order.newTotal),
        coupenName:order.coupenName,
        coupenPercentage:order.coupenPercentage,
        status: status,
        date: newdate,
        time: date,
        month: month,
        year: year,
      
      };
      products.forEach((element) => {
        element.trackOrder = "placed";
        

      });

      db.get()
        .collection(collection.ORDER_COLLECTION)
        .insertOne(orderObj)
        .then((response) => {
          products.forEach((element) => {
            let quantity = 0 - element.quantity;
            db.get()
              .collection(collection.PRODUCT_COLLECTION)
              .updateOne(
                { _id: ObjectID(element.item) },
                {
                  $inc: { stock: quantity },
                },
                {}
              );
          });

          db.get()
            .collection(collection.CART_COLLECTION)
            .deleteOne({ user: ObjectID(order.userId) });
          resolve(response.insertedId);
        });
    });
  },
  getCartProductDetails: (userId) => {
    console.log(userId);
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: ObjectID(userId) });
      resolve(cart.products);
    }).catch((err) => {
      console.log(err);
    });
  },
  getUserData: (userId) => {
    return new Promise(async (resolve, reject) => {
      let orders = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .find({ userId: ObjectID(userId) })
        .sort({ time: -1 })
        .toArray();
      resolve(orders);
    });
  },
  getOrderProducts: (orderId) => {
    return new Promise(async (resolve, reject) => {
      let orderItems = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $match: { _id: ObjectID(orderId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
              trackOrder: "$products.trackOrder",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              trackOrder: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();
      resolve(orderItems);
    });
  },
  cancelOrder: (orderId, product, proId, qnty) => {
   
    return new Promise(async(resolve, reject) => {
      //         product.forEach (element=>{

      // db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectID(element.item)},{

      //            $inc:{stock:element.
      //          quantity}

      //        })
      //       })
      order=await  db.get().collection(collection.ORDER_COLLECTION).findOne({_id:ObjectID(orderId)})
      

     
      payment=order.paymentMethod
      user=order.userId
      pro=await  db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectID(proId)})
      console.log(pro);
     
     
      price=parseInt(pro.price)
      limit=price*40/100
      offerPrice=limit*parseInt(order.coupenPercentage)/100
      newPrice=price-offerPrice
      

      // console.log("++++++");
      // console.log(newPrice);


      if(payment!='COD'){
        if(parseInt(order.
          coupenPercentage)>0){

          price=newPrice
        }
        else{
          price=parseInt(pro.price)
        }
        refferalData={
          amount:Math.ceil(price),
          date:new Date().toDateString(),
          Timestamp:new Date(),
          status:"credited",
          message:"Cancelled Amount"
      }
      await db.get().collection(collection.WALLET_COLLECTION).updateOne({userId:ObjectID(user)},{
        $inc:{
            balance:price
        },
        $push:{
            Transactions:refferalData
        }

      })
      // wallet=await db.get().collection(collection.WALLET_COLLECTION).findOne({userId:ObjectID(user)})
      // console.log(wallet);
      }
      

      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne(
          { _id: ObjectID(proId) },
          {
            $inc: { stock: parseInt(qnty) },
          }
        );

      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: ObjectID(orderId), "products.item": ObjectID(proId) },

          {
            $set: { "products.$.trackOrder": "canceled" },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  getAllOrders: () => {
    return new Promise(async (resolve, reject) => {
      let orders = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .find()
        .sort({ time: -1 })
        .toArray();
      resolve(orders);
    });
  },

  getAllproductDetails: (orderId) => {
    return new Promise(async (resolve, reject) => {
      let orderItems = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $match: { _id: ObjectID(orderId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
              trackOrder: "$products.trackOrder",
              note: "$products.note",
              discription: "$products.discription"
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              trackOrder: 1,
              note:1,
              discription:1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();
      resolve(orderItems);
    });
  },
  dispatchOrder: (orderId, proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: ObjectID(orderId), "products.item": ObjectID(proId) },
          {
            $set: { "products.$.trackOrder": "dispatched" },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  deliveredOrder: (orderId, proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: ObjectID(orderId), "products.item": ObjectID(proId) },
          {
            $set: { "products.$.trackOrder": "delivered" },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  shippedOrder: (orderId, proId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: ObjectID(orderId), "products.item": ObjectID(proId) },
          {
            $set: { "products.$.trackOrder": "shipped" },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  generateRazorpay: (orderId, total) => {
    return new Promise((resolve, reject) => {
      instance.orders.create(
        {
          amount: total * 100,
          currency: "INR",
          receipt: "" + orderId,
          notes: {
            key1: "value3",
            key2: "value2",
          },
        },
        function (err, order) {
          if (err) {
            console.log(err);
          }
          resolve(order);
        }
      );
    });
  },
  verifyPayment: (details) => {
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "ryeQB58igO1l1OUjr7S4rlNg");

      hmac.update(
        details["payment[razorpay_order_id]"] +
          "|" +
          details["payment[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");
      if (hmac == details["payment[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },
  changePaymentStatus: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: ObjectID(orderId) },
          {
            $set: {
              status: "placed",
            },
          }
        )
        .then((hai) => {
          console.log(hai);
          resolve();
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  generatePaypal: (orderId, total) => {
    return new Promise((resolve, reject) => {
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/cancel",
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: "Red Sox Hat",
                  sku: "001",
                  price: "25.00",
                  currency: "USD",
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: "USD",
              total: "25.00",
            },
            description: "Hat for the best team ever",
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              resolve(payment.links[i].href);
              db.get()
                .collection(collection.ORDER_COLLECTION)
                .updateOne(
                  { _id: ObjectID(orderId) },
                  {
                    $set: {
                      status: "placed",
                    },
                  }
                );
            }
          }
        }
      });
    });
  },
  addressSubmit: (address, userId) => {
    return new Promise((resolve, reject) => {
      address.user = ObjectID(userId);
      db.get()
        .collection(collection.ADDRESS_COLLECTION)
        .insertOne(address)
        .then(() => {});
    });
  },
  getAddress: (userId) => {
    return new Promise((resolve, reject) => {
      let address = db
        .get()
        .collection(collection.ADDRESS_COLLECTION)
        .find({ user: ObjectID(userId) })
        .toArray();
      resolve(address);
    });
  },
  getUser: (userId) => {
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ _id: ObjectID(userId) });

      resolve(user);
    });
  },
  updateUser: (details, userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne(
          { _id: ObjectID(userId) },
          {
            $set: {
              firstname: details.name,
              email: details.email,
              phonenumber: details.phonenumber,
            },
          }
        );
    });
  },
  getuserAddress: (addressId) => {
    return new Promise((resolve, reject) => {
      let address = db
        .get()
        .collection(collection.ADDRESS_COLLECTION)
        .findOne({ _id: ObjectID(addressId) });
      resolve(address);
    });
  },
  editAddress: (address, addressId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ADDRESS_COLLECTION)
        .updateOne(
          { _id: ObjectID(addressId) },
          {
            $set: {
              firstname: address.firstname,
              lastname: address.lastname,
              companyname: address.companyname,
              country: address.country,
              towncity: address.towncity,
              statecounty: address.statecounty,
              postcode: address.postcode,
              phonenumber: address.phonenumber,
              email: address.email,
            },
          }
        );
    });
  },
  deleteAddress: (addressId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ADDRESS_COLLECTION)
        .deleteOne({ _id: ObjectID(addressId) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  dailySalesReport: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $unwind: "$products",
          },
          {
            $match: {
              trackOrder: { $ne: "canceled" },
            },
          },
          {
            $group: {
              _id: "$date",
              dailySaleAmount: { $sum: "$totalAmount" },
              count: { $sum: 1 },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
        ])
        .toArray()
        .then((dailySales) => {
          let totalamount = 0;
          dailySales.forEach((element) => {
            totalamount += element.dailySaleAmount;
          });
          dailySales.totalamount = totalamount;
          resolve(dailySales);
        });
    });
  },
  monthlySalesReport: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $match: {
              status: { $ne: "pending" },
            },
          },
          {
            $group: {
              _id: "$month",
              monthlySaleAmount: { $sum: "$totalAmount" },
              count: { $sum: 1 },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
        ])
        .toArray()
        .then((monthlySales) => {
          let totalamount = 0;
          monthlySales.forEach((element) => {
            totalamount += element.monthlySaleAmount;
          });
          monthlySales.totalamount = totalamount;
          resolve(monthlySales);
        });
    });
  },
  yearlySalesReport: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $match: {
              status: { $ne: "pending" },
            },
          },
          {
            $group: {
              _id: "$year",
              yearlySaleAmount: { $sum: "$totalAmount" },
              count: { $sum: 1 },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
        ])
        .toArray()
        .then((yearlySales) => {
          let totalamount = 0;
          yearlySales.forEach((element) => {
            totalamount += element.yearlySaleAmount;
          });
          yearlySales.totalamount = totalamount;
          resolve(yearlySales);
        });
    });
  },
  addId: (name, userId) => {
    return new Promise(async (resolve, reject) => {
      console.log("****");
      console.log(name, userId);

      //    done=await db.get().collection(collection.COUPEN_COLLECTION).find({name:name,users:{$in:[userId]}}).toArray()
      //  if(done[1]){
      //   resolve("used")
      //  }else{
      update = db
        .get()
        .collection(collection.COUPEN_COLLECTION)
        .updateOne({ name: name }, { $push: { users: ObjectID(userId) } });
      resolve(update);
      //  }
    });
  },
  coupenCheck: (name, userId) => {
    return new Promise(async (resolve, reject) => {
      coupen = await db
        .get()
        .collection(collection.COUPEN_COLLECTION)
        .findOne({ name: name });

      if (coupen) {
        done = await db
          .get()
          .collection(collection.COUPEN_COLLECTION)
          .find({ users: { name: name, $in: [ObjectID(userId)] } })
          .toArray();
        if (done[1]) {
          resolve(done);
        }
      }
      // else{
      //  resolve("not used")
      // }
    });
  },
  //   ,getStock:(product)=>{
  // return new Promise(async(resolve, reject) => {
  //  let pro=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectID(product.product)})
  //  console.log(pro);

  //   resolve(pro)

  // })
  //   }
  getStatus: (id) => {
    return new Promise((resolve, reject) => {
      let status = db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .findOne({ _id: ObjectID(id) });
      resolve(status);
    });
  },
  getOrderAddress: (orderId) => {
    return new Promise((resolve, reject) => {
      let address = db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .findOne({ _id: ObjectID(orderId) });
      resolve(address);
    });
  },
  Details: (userI) => {
    return new Promise(async (resolve, reject) => {
      let cart = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .findOne({ userId: ObjectID(userI) });

      resolve(cart.products);
    });
  },
  topSellingProducts: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $unwind: "$products",
          },
          {
            $group: {
              _id: "$products.item",
              count: { $sum: "$products.quantity" },
            },
          },
          {
            $sort: { count: -1 },
          },
          {
            $limit: 5,
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "_id",
              foreignField: "_id",
              as: "productDetails",
            },
          },{
            $unwind:'$productDetails'
          },
        ])
        .toArray()
        .then((response) => {
          resolve(response);
        });
    });
  },
  getUserCount: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .find()
        .count()
        .then((response) => {
          resolve(response);
        });
    });
  },
  
    
 
  recentsales:()=> {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $unwind: "$products",
          },
         
          {
            $unwind:"$deliveryDetails"
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "products.item",
              foreignField: "_id",
              as: "productDetail",
            }
          },
          {
            $unwind:"$productDetail"
          },{
            $sort:{time:-1}
          },{
            $limit:6
          }
         

        
        ])
        .toArray()
        .then((response) => {
          resolve(response);
        });
    });
  },
  getRevenue:()=>{
    return new Promise((resolve, reject) => {
      let revenue=db.get().collection(collection.ORDER_COLLECTION).aggregate([{
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        }
      }

      ]).toArray()
      resolve(revenue)
    })
   
  },
  requestReturn:(pId,oId,details)=>{
    return new Promise(async(resolve, reject) => {
      await db.get().collection(collection.ORDER_COLLECTION).updateOne( { _id: ObjectID(oId), "products.item": ObjectID(pId) },{
        $set:{
          "products.$.trackOrder":'returnRequest',
          "products.$.note":details.note,
          "products.$.discription":details.discription
        }
      })
    })
  },


  returnApproved:(pId,oId)=>{
    return new Promise(async(resolve, reject) => {

      order=await  db.get().collection(collection.ORDER_COLLECTION).findOne({_id:ObjectID(oId)})
      

     
      user=order.userId
      pro=await  db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectID(pId)})
      console.log(pro);
     
     
      price=parseInt(pro.price)
      limit=price*40/100
      offerPrice=limit*parseInt(order.coupenPercentage)/100
      newPrice=price-offerPrice

      if(parseInt(order.
        coupenPercentage)>0){

        price=newPrice
      }
      else{
        price=parseInt(pro.price)
      }
      refferalData={
        amount:Math.ceil(price),
        date:new Date().toDateString(),
        Timestamp:new Date(),
        status:"credited",
        message:"Refund Amount"
    }

    await db.get().collection(collection.WALLET_COLLECTION).updateOne({userId:ObjectID(user)},{
      $inc:{
          balance:price
      },
      $push:{
          Transactions:refferalData
      }

    })

      await db.get().collection(collection.ORDER_COLLECTION).updateOne( { _id: ObjectID(oId), "products.item": ObjectID(pId) },{
        $set:{
          "products.$.trackOrder":'returnApproved',
        
        }
      })
    })
  },
  changePassword: (details) => {
    return new Promise(async (resolve, reject) => {
        let oldPass = details.oldPass
        let newPass = details.newPass
        let conPass = details.conPass
        userid=details.userId
        let user=await db.get().collection(collection.USER_COLLECTION).findOne({_id: ObjectID(userid)})


        let response = {}
        if (user) {
            bcrypt.compare(oldPass,user.password).then(async (status) => {
                if (status) {
                    console.log("correct password sucess");
                    response.status = true
                    response.message = ""
                    if (newPass==conPass) {
                        conPass =await bcrypt.hash(conPass,10)
                        db.get().collection(collection.USER_COLLECTION).updateOne({_id: ObjectID(userid)}, {
                            $set: {
                                password: conPass
                            }
                        }).then(() => {
                            response.status = true
                            response.message = ""
                            resolve(response)
                        })
                    } else {
                        response.message = "Password does not match"
                        resolve({ status: false })
                    }
                } else {
                    console.log('incorrect password');
                    response.message = "Incorrect Password"
                    resolve({ status: false })
                }
            })
        }
    })
}


};
