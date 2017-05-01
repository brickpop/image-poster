var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var schema = new Schema({
	name: { type: String, required: true, unique: true },
	created: { type: Date, default: Date.now },
	pictures: [{ type: String, required: true}]
}, {
	collection: 'albums'
});

module.exports = mongoose.model('Album', schema);
