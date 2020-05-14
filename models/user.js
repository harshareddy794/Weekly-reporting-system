var mongoose= require("mongoose")
var passportLocalMongoose=require("passport-local-mongoose")
var userSchema= new mongoose.Schema({
    name: String,
    email:String,
    username: {type: String, unique: true, required: true},
    password: String,
})

userSchema.plugin(passportLocalMongoose)

module.exports= mongoose.model("user",userSchema)