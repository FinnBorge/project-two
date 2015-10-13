var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var userSchema = new Schema({
  name: String ,
  email: { type: String, set: toLower, index: { unique: true }, validate: /\u0040/ } ,
  password: String,
  dateCreated: { type: Date, default: Date.now },
  location: { type: String, set: toLower } ,
  written: Number,
  edits: Number,
  administrator: Boolean,
  trusted: Boolean,
});

articleSchema.methods.findMyArticles = function (callback) {
  return this.model('User').find({ author: this.name }, callback);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
