const mongoose=require("mongoose")
const s=new mongoose.Schema({
  o:{type:String,required:true},
  s:{type:String,required:true,unique:true},
  clicks:[{
    t:{type:Date,default:Date.now}
  }],
  createdAt:{type:Date,default:Date.now},
  
})


module.exports=mongoose.model("Url",s)