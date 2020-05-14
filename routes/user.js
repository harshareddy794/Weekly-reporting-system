var express=require("express")
var router=express.Router({mergeParams: true})
var passport=require("passport")
var user=require("../models/user")
var report=require("../models/report")



router.get("/user/:id",isLoggedIn,function(req,res){
    user.findById(req.params.id,function(err,foundUser){
        if(err){
            req.flash("error","Some  thing went wrong")
            res.redirect("back")        
        }else{
            report.find().where("user.id").equals(foundUser._id).limit(15).sort({createdAt:-1}).exec(function(err,foundReports){
                if(err){
                    req.flash("error","Some  thing went wrong")
                    res.redirect("back")                
                }else{
                    res.render("user/user",{foundUser:foundUser,foundReports:foundReports})
                }
            })
        }
    })
})

router.get("/user/:id/edit",isAuthorised,function(req,res){
    user.findById(req.params.id,function(err,foundUser){
        if(err){
            console.log(err)
        }else{
            res.render("user/edit",{foundUser:foundUser})

        }
    })
})

router.put("/user/:id",isAuthorised,function(req,res){
    var data={
        email:req.body.email,
        name:req.body.name,
    }
    user.findByIdAndUpdate(req.params.id,data,function(err,foundUser){
        if(err){
            req.flash("error","Some  thing went wrong")
            res.redirect("back")
        }else{
            req.flash("success","Successfully updated your profile")
            res.redirect("/user/"+foundUser._id)
        }
    })
})


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
                req.flash("success","Successfully signed up and logged you in")
                res.redirect("/report")
            })
    })
})

router.get("/login",function(req,res){
    res.render("user/login")
})

router.post("/login",passport.authenticate("local",{
    successFlash:"Logged in successfully",
    successRedirect: "/report",
    failureFlash:true,
    failureRedirect: "/login",
}),function(req,res){
})

router.get("/logout",function(req,res){
    req.logOut()
    req.flash("success","Logged you out succesfully!")
    res.redirect("/")
})

module.exports=router

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash("error","You must be logged in first")
        res.redirect("/login")
    }
}

function isAuthorised(req,res,next){
    if(req.isAuthenticated()){
        user.findById(req.params.id,function(err,founduser){
            if(err){
                req.flash("error","Some thing went wrong")
                res.redirect("back")
            }else{
                if((founduser._id).equals(req.user._id)){
                    next()
                }else{
                    req.flash("error","Access denied")
                    res.redirect("back")
                }
            }
        })
    }else{
        req.flash("error","You must be logged in first")
        res.redirect("/login")
    }
}