var express=require("express")
var router=express.Router({mergeParams: true})
var user=require("../models/user")
var passport=require("passport")


router.get("/signup",function(req,res){
    res.render("user/signup.ejs")
})

router.post("/signup",function(req,res){
    var userData={
        name: req.body.name,
        email:req.body.email,
        username: req.body.username,
    }
    user.register(userData,req.body.password,function(err,foundUser){
        if(err){
            console.log(err)
            res.redirect("back")
        }
            passport.authenticate("local")(req,res,function(){
                res.redirect("/report")
            })
    })
})

router.get("/login",function(req,res){
    res.render("user/login")
})

router.post("/login",passport.authenticate("local",{
    successRedirect: "/report",
    // successFlash:"Logged in successfully",
    failureRedirect: "/login",
    // failureFlash:true
}),function(req,res){
})

router.get("/logout",function(req,res){
    req.logOut()
    res.redirect("/")
})

module.exports=router