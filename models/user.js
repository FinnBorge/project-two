var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  dateCreated: { type: Date, default: Date.now },
  country: String,
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
