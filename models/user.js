var mongoose= require("mongoose")
var passportLocalMongoose=require("passport-local-mongoose")
 var userSchema= new mongoose.Schema({
  fname: String,
  lname:String,
  email: String,
  username: {type: String, unique: true, required: true},
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isAdmin:{type:Boolean,default:false},
  avatarurl: {type: String, default: "/pictures/avatar.png"}
 })

 userSchema.plugin(passportLocalMongoose)

 module.exports= mongoose.model("user",userSchema)
