var db=require('../confi/connection')
var collection=require('../confi/collections')
const { ObjectID } = require('bson')
const cookieParser = require('cookie-parser')
module.exports={
  insertcategory:(category)=>{
    return new Promise((resolve, reject) => {
        db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category).then((response)=>{
            resolve(response.insertedId)
        })
  
    })
  },
  // getcategory:()=>{
  //   return new Promise((resolve, reject) => {
  //       let category=db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
  //           resolve(category)
        
  //   })
  // },
  getcategory:()=>{
    return new Promise((resolve, reject) => {
        let category=db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(category)
        
    })
  }  ,selectcategory:()=>{
    return new Promise((resolve, reject) => {
let category=db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(category)
        
    })
  },
  deletecategory:(catid)=>{
return new Promise((resolve, reject) => {
    db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:ObjectID(catid)}).then((response)=>{
        resolve(resolve)
    })
})
  },
  
  categorydetails:(catid)=>{
  return new Promise((resolve, reject) => {
    category=db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:ObjectID(catid)}).then((category)=>{
        resolve(category)
    })
  })
  },
  bannerdetails:(catid)=>{
    return new Promise((resolve, reject) => {
          category=db.get().collection(collection.BANNER_COLLECTION).findOne({_id:ObjectID(catid)}).then((category)=>{
          resolve(category)
      })
    })
    },   updatecategory:(catid,catdetails,img)=>{
    return new Promise((resolve, reject) => {
      db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id:ObjectID(catid)},{
        $set:{
          name:catdetails.name,
          
          discription:catdetails.discription,
          img:catdetails.img
         
      }}).then((response)=>{
          resolve()
      })
      
      })
    
   }, checkcategory:(category)=>{
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log(category);
    return new Promise(async(resolve, reject) => {
      let categoryStatus=false
      let response={}
      let check=await db.get().collection(collection.CATEGORY_COLLECTION).findOne({name:category.name})
    if(check){
      console.log('_________________');
      console.log(check);
      response.category=check
      response.status=true
      response.message ="Category already exist" 
  resolve(response)
}
else{
  db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category)
   

 resolve({status:false})
}
    })

   },
   updatebanner:(catid,catdetails)=>{
    return new Promise((resolve, reject) => {
      db.get().collection(collection.BANNER_COLLECTION).updateOne({_id:ObjectID(catid)},{
        $set:{
          name:catdetails.name,
          
          discription:catdetails.discription,
          img:catdetails.img
         
      }}).then((response)=>{
          resolve(response)
      })
      
      })
    
   }

}
