var express=require("express")
var app=express()
app.use(express.static("public"))
app.set("view engine","ejs")

//++++++++++ Mongoose ++++++++++++
var mongoose=require("mongoose")
mongoose.connect("mongodb://localhost/weeklyreport",{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false,useCreateIndex:true})

var reportschema=new mongoose.Schema({
    user:String,
    date:String,
    report:String
})
var report=mongoose.model("report",reportschema)
// report.create({
//     user:"Harsha",
//     date:"20-10-2020",
//     report:"Got my work done"
// },function(err,report){
//     if(err){
//         console.log(err)
//     }else{
//         console.log(report)
//     }
// })

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

app.listen(3000,"127.0.0.1",function(req,res){
    console.log("app is listining")
})