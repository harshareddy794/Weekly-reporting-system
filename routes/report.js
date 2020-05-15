var express=require("express")
var router=express.Router({mergeParams: true})
var report=require("../models/report")


router.get("/report",isLoggedIn,function(req,res){
    report.find().limit(25).sort({createdAt:-1}).exec(function(err,reports){
        if(err){
            req.flash("error","Some  thing went wrong")
            res.redirect("back")
        }else{
            res.render("report/reports",{reports:reports})
        }
    })
})


//create
router.get("/report/new",isLoggedIn,function(req,res){
    res.render("report/new")
})

router.post("/report",isLoggedIn,function(req,res){
    var user={
        id:req.user._id,
        username:req.user.username
    }
    var newReport={
    user:user,
    date:req.body.date,
    desc:req.body.desc
}
    report.create(newReport,function(err,report){
        if(err){
            req.flash("error","Some  thing went wrong")
            res.redirect("back")
        }else{
            req.flash("success","Report added successfully")
            res.redirect("/report")
        }

    })
})


//Update
router.get("/report/:id/edit",isAuthorised,function(req,res){
    report.findById(req.params.id,function(err,foundReport){
        if(err){
            req.flash("error","Some  thing went wrong")
            res.redirect("back")
        }else{
            res.render("report/edit",{report:foundReport})
        }
    })
})

router.put("/report/:id",isAuthorised,function(req,res){
    var data={
        date:req.body.date,
        desc:req.body.desc 
    }
    report.findByIdAndUpdate(req.params.id,data,function(err,updatedReport){
        if(err){
            req.flash("error","Some  thing went wrong")
            res.redirect("back")
        }else{
            req.flash("success","Updated report successfully")
            res.redirect("/report")
        }
    })
})



//Delete
router.delete("/report/:id",isAuthorised,function(req,res){
    report.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error","Some  thing went wrong")
            res.redirect("back")
        }else{
            req.flash("success","Deleted report successfully")
            res.redirect("/report")
        }
    })
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
        report.findById(req.params.id,function(err,foundReport){
            if(err){
                console.log(err)
                res.redirect("back")
            }else{
                if(((foundReport.user.id).equals(req.user._id)) || req.user.isAdmin==true){
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