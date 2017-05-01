const Album = require('../models/album.js');

///////////////////////////////////////////////////////////////////////////////
// ENTRIES
///////////////////////////////////////////////////////////////////////////////

async function getAlbums(req, res) {
	const entries = await Album.find().sort('-created').populate('created').lean().exec();
	res.send(entries);
}


module.exports = {
	getAlbums
};
