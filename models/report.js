var mongoose=require("mongoose")

var reportschema=new mongoose.Schema({
    user:String,
    date:String,
    desc:String
})

module.exports=mongoose.model("report",reportschema)