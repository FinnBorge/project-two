var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var tagSchema = new Schema ({
  name: {type: String, set: toLower, index: { unique: true }},
  instances: Number
});
