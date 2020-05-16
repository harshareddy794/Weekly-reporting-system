var express=require("express")
var app=express()
app.use(express.static("public"))
app.set("view engine","ejs")
var  bodyparser=require("body-parser")
app.use(bodyparser.urlencoded({extended:true}))
var methodOverride= require("method-override")
app.use(methodOverride("method"))
var flash = require('connect-flash');
app.use(flash());
require('dotenv').config();

//++++++++++ Mongoose ++++++++++++
var mongoose=require("mongoose")
mongoose.connect(process.env.URL,{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false,useCreateIndex:true},function(err){
    if(err){
        console.log("cannot connect to database")
    }
})
//++++++++++ Models ++++++++++++++++++
var user=require("./models/user")


//++++++++++++ Passport initilize ++++++++++++++++++++
var passport=require("passport")
var localStratagy=require("passport-local")
var expressSessions=require("express-session")

app.use(expressSessions({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized :false
}))
app.use(passport.initialize())
app.use(passport.session())


//++++++++++++ Passport use ++++++++++++++++++++
passport.use(new localStratagy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())


app.use(function(req, res, next){
    res.locals.currentUser = req.user
    res.locals.error=req.flash("error")
    res.locals.success= req.flash("success")
    next();
 });


//++++++++++++++ Routes import ++++++++++++++
var reportRoutes=require("./routes/report")
var userRoutes=require("./routes/user")
//++++++++++++++ Routes use ++++++++++++++

app.get("/",function(req,res){
    res.render("landing.ejs")
})

app.use(reportRoutes)
app.use(userRoutes)
//++++++++++++ Other routes+++++++++++++++++++++


app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log("app is listining")
})