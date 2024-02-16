var db = require('../confi/connection')
var collection = require('../confi/collections')
const ObjectID = require('mongodb').ObjectId
var code = require('voucher-code-generator');
const { Transaction } = require('mongodb');


module.exports={
    addWallet:(userId)=>{
        return new Promise((resolve, reject) => {
         db.get().collection(collection.WALLET_COLLECTION).insertOne({
            userId:userId,
            balance:parseInt(0),
            Transactions:[]
         })
         
        })
    },
    getWallet:(userId)=>{
    return new Promise((resolve, reject) => {
        let wallet=db.get().collection(collection.WALLET_COLLECTION).findOne({userId:ObjectID(userId)})
        resolve(wallet)
    })
    },
    addAmount:(userId)=>{
        console.log("(((((");
        console.log(userId);
        return new Promise((resolve, reject) => {
            refferalData={
                amount:parseInt(50),
                date:new Date().toDateString(),
                Timestamp:new Date(),
                status:"credited",
                message:"Refferal Amount"
            }
          db.get().collection(collection.WALLET_COLLECTION).updateOne({userId:ObjectID(userId)},{
            $inc:{
                balance:parseInt(50)
            },
            $push:{
                Transactions:refferalData
            }

          })
        })
    },
         
    refferalAmount:(reff,amount)=>{
        return new Promise(async(resolve, reject) => {
     
           let refferal=await db.get().collection(collection.USER_COLLECTION).findOne({refferals:reff.refferals})
           if(refferal){
            refferalData={
                amount:amount,
                date:new Date().toDateString(),
                Timestamp:new Date(),
                status:"credited",
                message:"Refferal Amount"
            }
            db.get().collection(collection.WALLET_COLLECTION).updateOne({userId:refferal._id},{
                $inc:{
                    balance:amount
                },
                $push:{
                    Transactions:refferalData
                }
            })
         }
        })
    },
    
    FromWallet:(userId,totalPrice)=>{
        return new Promise((resolve, reject) => {
            let price=(0-totalPrice)
            console.log("^^^^^^^");
            console.log(userId,totalPrice);
            refferalData={
                amount:totalPrice,
                date:new Date().toDateString(),
                Timestamp:new Date(),
                status:"Debited",
                message:"Purchased"
            }
           
            db.get().collection(collection.WALLET_COLLECTION).updateOne({userId:ObjectID(userId)},{
                $inc:{balance:price},
                $push:{
                    Transactions:refferalData
                }
            })
        })
    },
    getWalletAmount:(userId)=>{
        return new Promise((resolve, reject) => {
            let wallet=db.get().collection(collection.WALLET_COLLECTION).findOne({userId:ObjectID(userId)})
            resolve(wallet)
        })
    }
}