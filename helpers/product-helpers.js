var db=require('../confi/connection')
const MongoClient=require('../confi/connection')

var collection=require('../confi/collections')
const { ObjectID } = require('bson')
module.exports={
    getallusers:()=>{
        return new Promise(async(resolve,reject)=>{
          let details=await db.get().collection(collection.USER_COLLECTION).find().toArray()
          resolve(details)
        }) 
     },
     insertproducts:(product)=>{
      product.review=[]
      product.price = parseInt(product.price)
      return new Promise((resolve, reject) => {
          db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((response)=>{
          resolve(response.insertedId)
        })
      })
     },
     getproduct:()=>{
      return new Promise(async(resolve, reject) => {
        let product=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
        resolve(product)
      })
     }, getproductsp:(limit)=>{
      return new Promise(async(resolve, reject) => {
        let product=await db.get().collection(collection.PRODUCT_COLLECTION).find().skip(limit.startFrom).limit(limit.perpage).toArray()
        resolve(product)
      })
     },

     deleteproduct:(proId)=>{
      return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectID(proId)}).then((response)=>{
        resolve(response)
        })
      })
     },
     productdetails:(product)=>{
      return new Promise((resolve, reject) => {
       let products=   db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectID(product)})
       resolve(products)
        })
    
     },
     updateproducts:(productid,productdetails)=>{
      return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectID(productid)},{
          $set:{
            name:productdetails.name,
            category:productdetails.category,
            discription:productdetails.discription,
            price:productdetails.price,
            img:productdetails.img,
            stock:parseInt(productdetails.stock),
            review:[]
        }}).then((response)=>{
            resolve()
        })
        
        })
      
     },
     getcategoryproduct:(name,page)=>{

            start=page.startFrom
          return new Promise(async(resolve,reject)=>{
          let products = await db.get().collection(collection.PRODUCT_COLLECTION).find({
          
          category:name}).skip(start).limit(page.perpage).toArray()
       
          resolve(products)
        })
     },
    getCount:(catname)=>{
      console.log("______");
      console.log(catname);
      return new Promise(async(resolve, reject) => {
        let count=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:catname}).toArray()
        console.log("&&");
        console.log(count);
        resolve(count.length)
      })
     },getCountProducts:()=>{
      // return new Promise(async(resolve, reject) => {
      //   let count=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
      //   resolve(count.length)
      // })
      return new Promise(async(resolve, reject) => {
        let count=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
       resolve(count.length)
      })
     }
    //  addOffer:(percent)=>{
    //   offer=parseInt(percent.percentage)
    //   return new Promise((resolve, reject) => {
    //     db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectID(percent.percentage)},{
    //     $set:{
    //      percentage:percent.percentage
    //     }
    //     })
      
    //   })
    //  },
     ,setOffer:(percent)=>{
      console.log(percent);
       offer=parseInt(percent.persentage)
   
      

        return new Promise(async(resolve, reject) => {
        product=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectID(percent.proId)})
        oldprice=product.price

        newprice=product.price-(product.price*(offer/100))
        newprice=Math.round(newprice)
      
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectID(percent.proId)},{
        $set:{
         price:parseInt(newprice),
         productofferpercent:offer,
         oldprice:oldprice,
         newprices:newprice,
      

        }
        })
      
      })
     },
     deleteoffer:(proId)=>{
      return new Promise(async(resolve, reject) => {
        product=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectID(proId)})
        console.log("***");
        console.log(product);
         let oldprices=product.oldprice
         console.log(oldprices);
       db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectID(proId)},{$unset:{oldprice:"",newprices:"",productofferpercent:""},
          $set:{
           price:oldprices
            
          
        
        }}).then((response)=>{
        resolve(response)
      })
      })
     },
     addCoupen:(coupen)=>{
      coupen.users=[]
      return new Promise((resolve, reject) => {
        coupen.status=true
        db.get().collection(collection.COUPEN_COLLECTION).insertOne(coupen)
      })
     },
     getCoupenDetails:(userId)=>{
      return new Promise(async(resolve, reject) => {
        done = await db.get().collection(collection.COUPEN_COLLECTION).find({users:{$nin:[ObjectID(userId)]}}).toArray()

      //  let coupen=await db.get().collection(collection.COUPEN_COLLECTION).find().toArray()
    
       resolve(done)
      })
     },
     fetchCoupen:(coupenId)=>{
      return new Promise(async(resolve, reject) => {
       done = await db.get().collection(collection.COUPEN_COLLECTION).findOne({_id:ObjectID(coupenId)}) 
       resolve(done)
      })
     },

     deletecoupen:(proId)=>{
      return new Promise((resolve, reject) => {
        db.get().collection(collection.COUPEN_COLLECTION).deleteOne({_id:ObjectID(proId)}).then((response)=>{
        resolve(response)
        })
      })
     },
  findCoupen:(coupen,userId)=>{

  return new Promise(async(resolve, reject) => {

      result= db.get().collection(collection.COUPEN_COLLECTION).findOne({name:coupen.name})
      if(result){

      done = await db.get().collection(collection.COUPEN_COLLECTION).find({name:coupen.name,users:{$in:[ObjectID(userId)]}}).toArray()
  // expire=await db.get().collection(collection.COUPEN_COLLECTION).find({status:'expired'}).toArray()
     console.log("****((((((");
    console.log(done);
  // if(expire[0]){
  //   resolve("used")
  // }
 if(done[0]){
   resolve("used")
   console.log("used");
  }else {
    resolve(result)
    console.log(result);
    console.log("in");
  }
   }
   else{
    resolve("not here")
    console.log("not");
   }
     
 


 

    
   })
     },
     addBanner:(banner)=>{
      return new Promise((resolve, reject) => {
        db.get().collection(collection.BANNER_COLLECTION).insertOne(banner)
      })
     },getBanner:()=>{
      return new Promise(async(resolve, reject) => {
        let banne=await db.get().collection(collection.BANNER_COLLECTION).find().toArray()
        resolve(banne)
      })
     },deletebanner:(catid)=>{
      return new Promise((resolve, reject) => {
          db.get().collection(collection.BANNER_COLLECTION).deleteOne({_id:ObjectID(catid)}).then((response)=>{
              resolve(resolve)
          })
      })
        }, ProductDetails:(Id) => {
       
          return new Promise(async (resolve, reject) => {
            let details = await db.get().collection(collection.ORDER_COLLECTION).findOne({_id:ObjectID(Id)})
           
            resolve(details.products)
      
          })
        },
          cancelOrder: (orderId,product) => {
          console.log(orderId)
          return new Promise((resolve, reject) => {
      product.forEach(element=>{
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectID(element.item)},{
        
         $inc:{stock:element.
          quantity}
       })
      })
       
       
      db.get().collection(collection.ORDER_COLLECTION).updateOne({ _id: ObjectID(orderId) },
{
  $set:{
    "products.$.status":"canceled"   
  }
}
      ).then((response) => {
        resolve(response)
      })
    })
  },
  addReview:(message)=>{
    return new Promise((resolve, reject) => {
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
          { _id: ObjectID(message.proId) },
          {
            $push: { review: message },
          }
        )
    })
   }, 
   getReviewCount:(proId)=>{
    
    return new Promise(async(resolve, reject) => {
      let count=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectID(proId)})
      console.log("&&");
      console.log(count);
      coun=count.review
      resolve(coun.length)
    })
   },getFilter:(filter)=>{
    console.log(filter.HtoT);
    return new Promise(async(resolve, reject) => {
      if(filter.name=='HtoT'){
              let a=await db.get().collection(collection.PRODUCT_COLLECTION).find( {$and:[{price:{$gt:300}},{price:{$lt:500}}]} ).toArray()
              resolve(a)
            
             
      }

      else if(filter.name=='TtoTH'){
        let a=await db.get().collection(collection.PRODUCT_COLLECTION).find( {$and:[{price:{$gt:500}},{price:{$lt:600}}]} ).toArray()
        resolve(a)
      }
      else {
        let a=await db.get().collection(collection.PRODUCT_COLLECTION).find( {$and:[{price:{$gt:600}},{price:{$lt:900}}]} ).toArray()
        resolve(a)
      }
    
    
    })
   },searchProducts: (details) => {
    console.log("llllllllllllllllllllllllllllll");
    console.log(details.searchItem);
    return new Promise(async(resolve, reject) => {
        let x = details.searchItem;
         let search=await db.get().collection(collection.PRODUCT_COLLECTION).find({$or:[{
          name:{
            $regex:'.*'+x+'.*',$options:'i'
          }
         }]}).toArray()
         console.log(search);
         resolve(search)
    })
},checkCoupen: () => {
  return new Promise((resolve, reject) => {
     var date = new Date();

        var month = date.getUTCMonth() + 1; 
        var day = date.getUTCDate();
        var year = date.getUTCFullYear()
        newdate = year + "-" + month + "-" + day
        console.log(newdate);
       
      db.get().collection(collection.COUPEN_COLLECTION).update({ 'expiryDate': newdate }, {
          $set: {
              status: 'expired'
          }
      })
  })
}
     
}
