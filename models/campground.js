var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   image_id:String,
   description: String,
   price: String,
   createdAt: { type: Date, default: Date.now },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   user:{
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "user"
      },
      username: String
   }
});

module.exports = mongoose.model("Campground", campgroundSchema);