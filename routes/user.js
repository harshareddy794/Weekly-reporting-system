var express=require("express")
var router=express.Router({mergeParams: true})
var passport=require("passport")
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
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
    if(process.env.ACCESSCODE==req.body.accesscode){
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
    }else{
        req.flash("error","Invalid access code")
        res.redirect("back")
    }
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

//++++++++++++++++Password reset routes ++++++++++++++++
router.get('/forgot', function(req, res) {
    res.render('user/forgot');
  });
  
  router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(50, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        user.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user:process.env.MAIL ,
            pass: process.env.MAILPASS
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'admin-weeklyreport@gmail.com',
          subject: 'Weekly report Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('user/reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        user.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user:process.env.MAIL ,
            pass: process.env.MAILPASS
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'admin-weeklyreport@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/report');
    });
  });


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