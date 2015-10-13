var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

function toLower (v) {
  return v.toLowerCase();
}

var userSchema = new Schema({
  name: String ,
  email: { type: String, index: { unique: true }, validate: /\u0040/,  set: toLower} ,
  password: String,
  dateCreated: { type: Date, default: Date.now },
  location: { type: String, set: toLower } ,
  written: Number,
  edits: Number,
  administrator: Boolean,
  trusted: Boolean,
});

userSchema.methods.findMyArticles = function (callback) {
  return this.model('User').find({ author: this.name }, callback);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
