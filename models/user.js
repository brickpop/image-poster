var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var schema = new Schema({
  oauthId: { type: String, required: true },
  email: { type: String, required: true },

  fullName: { type: String },
  name: { type: String },
  lastName: { type: String },

	admin: { type: Boolean, default: false }
}, {
	collection: 'users'
});

module.exports = mongoose.model('User', schema);
