const mongoose = require("mongoose");
const regex = /^[a-z|A-Z|0-9|]+$/;
const UserSchema = new mongoose.Schema({
  nickname: {
      type: String,
      minlength: 3,
      regex
  },
  password: {
      type: String,
      minlength: 4
  },
});
UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});
UserSchema.set("toJSON", {
  virtuals: true,
});
module.exports = mongoose.model("User", UserSchema);