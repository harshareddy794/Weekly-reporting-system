var express=require("express")
var app=express()
app.use(express.static("public"))
app.set("view engine","ejs")
var  bodyparser=require("body-parser")
app.use(bodyparser.urlencoded({extended:true}))
//++++++++++ Mongoose ++++++++++++
var mongoose=require("mongoose")
mongoose.connect("mongodb://localhost/weeklyreport",{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false,useCreateIndex:true})

var reportschema=new mongoose.Schema({
    user:String,
    date:String,
    desc:String
})
var report=mongoose.model("report",reportschema)

app.get("/",function(req,res){
    res.render("landing.ejs")
})


app.get("/reports",function(req,res){
    report.find(function(err,reports){
        if(err){
            console.log(err)
        }else{
            res.render("report/reports",{reports:reports})

        }
    })
})

app.get("/reports/new",function(req,res){
    res.render("report/new")
})

app.post("/reports",function(req,res){
    var newReport={
    user:req.body.user,
    date:req.body.date,
    desc:req.body.desc
}
    report.create(newReport,function(err,report){
        if(err){
            console.log(err)
        }else{
            console.log(report)
            res.redirect("/reports")
        }

    })
})

app.listen(3000,"127.0.0.1",function(req,res){
    console.log("app is listining")
})