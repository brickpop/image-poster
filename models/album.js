var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var schema = new Schema({
	name: { type: String, required: true },
	created: { type: Date, default: Date.now },
	pictures: [{
		fileName: {type: String, required: true},
		type: { type: String, enum: ['picture', 'video'], required: true}
	}]
}, {
	collection: 'albums'
});

module.exports = mongoose.model('Album', schema);
