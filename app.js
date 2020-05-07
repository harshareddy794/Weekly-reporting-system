var express=require("express")
var app=express()
app.use(express.static("public"))
app.set("view engine","ejs")
var  bodyparser=require("body-parser")
app.use(bodyparser.urlencoded({extended:true}))
var methodOverride= require("method-override")
app.use(methodOverride("method"))

//++++++++++ Mongoose ++++++++++++
var mongoose=require("mongoose")
mongoose.connect("mongodb://localhost/weeklyreport",{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false,useCreateIndex:true})

var reportschema=new mongoose.Schema({
    user:String,
    date:String,
    desc:String
})

//++++++++++ Models ++++++++++++++++++

var report=require("./models/report")




//++++++++++++++ Routes ++++++++++++++

app.get("/",function(req,res){
    res.render("landing.ejs")
})


app.get("/report",function(req,res){
    report.find(function(err,reports){
        if(err){
            console.log(err)
        }else{
            res.render("report/reports",{reports:reports})

        }
    })
})


//create
app.get("/report/new",function(req,res){
    res.render("report/new")
})

app.post("/report",function(req,res){
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
app.get("/report/:id/edit",function(req,res){
    report.findById(req.params.id,function(err,foundReport){
        if(err){
            console.log(err)
        }else{
            res.render("report/edit",{report:foundReport})
        }
    })
})

app.put("/report/:id",function(req,res){
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
app.delete("/report/:id",function(req,res){
    report.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect("/report")
        }
    })
})


app.listen(3000,"127.0.0.1",function(req,res){
    console.log("app is listining")
})