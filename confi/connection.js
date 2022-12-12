const MongoClient=require('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect=function(done){
    const url='mongodb+srv://jithin97972:jithin1234@cluster0.ldzzlzo.mongodb.net/test'
    const dbname='project'

    MongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
state.db=data.db(dbname)
done()
    })
  
}
module.exports.get = function(){
    return state.db
}

