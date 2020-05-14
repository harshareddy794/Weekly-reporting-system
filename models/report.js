var mongoose=require("mongoose")

var reportschema=new mongoose.Schema({
    date:String,
    desc:String,
    createdAt: { type: Date, default: Date.now },
    user:{
        id:{
           type: mongoose.Schema.Types.ObjectId,
           ref: "user"
        },
        username: String
     }
})

module.exports=mongoose.model("report",reportschema)