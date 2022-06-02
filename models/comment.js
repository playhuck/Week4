const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
// 게시물에 번호를 자동으로 생성해준다.

const commentSchema = new mongoose.Schema({
    // _id: Schema.Types.ObjectId,
    comment: {
        type:String,
    },
    nickname: {
        type:String,
    },
    Id: {
        type:String,
    },
});

commentSchema.plugin(AutoIncrement, { inc_field: 'commentId' }); //댓글 번호 자동생성

module.exports = mongoose.model("Comm", commentSchema);