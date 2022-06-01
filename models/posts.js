const mongoose = require("mongoose");

const Postschema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required:true
    },
    author: {
        type: String,
        required: true,
    },
    contents: {
        type: String,
        required: true
    },
    date: {
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Post", Postschema);