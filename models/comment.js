const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    // _id: Schema.Types.ObjectId,
    comment: {
        type:String,
        required: true
    },
    author: {
        type:String,
        required: true,
    },
    Id: {
        type:String,
    }
});


module.exports = mongoose.model("Comm", commentSchema);