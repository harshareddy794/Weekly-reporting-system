var express=require("express")
var router=express.Router({mergeParams: true})
var report=require("../models/report")


router.get("/report",function(req,res){
    report.find(function(err,reports){
        if(err){
            console.log(err)
        }else{
            res.render("report/reports",{reports:reports})

        }
    })
})


//create
router.get("/report/new",function(req,res){
    res.render("report/new")
})

router.post("/report",function(req,res){
    var newReport={
    user:req.body.user,
    date:req.body.date,
    desc:req.body.desc
}
    report.create(newReport,function(err,report){
        if(err){
            console.log(err)
        }else{
            res.redirect("/report")
        }

    })
})


//Update
router.get("/report/:id/edit",function(req,res){
    report.findById(req.params.id,function(err,foundReport){
        if(err){
            console.log(err)
        }else{
            res.render("report/edit",{report:foundReport})
        }
    })
})

router.put("/report/:id",function(req,res){
    var data={
        user:req.body.user,
        date:req.body.date,
        desc:req.body.desc 
    }
    report.findByIdAndUpdate(req.params.id,data,function(err,updatedReport){
        if(err){
            console.log(err)
        }else{
            res.redirect("/report")
        }
    })
})



//Delete
router.delete("/report/:id",function(req,res){
    report.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect("/report")
        }
    })
})

module.exports=router