var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    user: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);
