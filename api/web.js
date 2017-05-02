import config from '../config/server'
import Busboy from 'busboy';
import fs from 'fs';
import path from 'path';

const Album = require('../models/album.js');

if(!fs.existsSync(config.STORAGE_FOLDER)){
	try {
		fs.mkdirSync(config.STORAGE_FOLDER);
	}
	catch(err){
		console.error("The storage folder does not exist", config.STORAGE_FOLDER);
		process.exit(1);
	}
}

///////////////////////////////////////////////////////////////////////////////
// ALBUMS
///////////////////////////////////////////////////////////////////////////////

async function createAlbum(req, res) {
	if(!req.body.name) return res.send({error: "Please, choose a name for the album"});

	try {
		let needle = await Album.findOne({name: new RegExp(req.body.name, 'i')}).lean().exec();
		if(needle) return res.send({id: needle._id});

		const data = await Album.create({
			name: req.body.name,
			files: []
		});
		res.send({id: data._id});
	}
	catch(err){
		res.send({error: err && err.message || "Unable to complete the request"});
	}
}

async function addPictureToAlbum(req, res) {
	if(!req.params.id) return res.send({error: "Invalid parameters"});

	try {
		const album = await Album.findById(req.params.id).lean().exec();
		if(!album) return res.send({error: "Album not found"});

		const files = [];

		var busboy = new Busboy({ headers: req.headers });
		busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			const destFileName = Date.now() + '-' + ((Math.random()+'').substr(2)) + path.extname(filename);
			files.push(destFileName);

			const saveTo = path.join(config.STORAGE_FOLDER, destFileName);
			file.pipe(fs.createWriteStream(saveTo));
		});
		busboy.on('finish', async function() {
			try {
				let updatedAlbum = await Album.findByIdAndUpdate(req.params.id, {
					$addToSet: { pictures: { $each: files.map(f => ({fileName: f, type: 'image'})) } }
				}, {new: true}).lean().exec();
				res.send(updatedAlbum);
			}
			catch(err){
				res.send({error: err && err.message || err || "Unable to complete the operation"});
			}
		});

		return req.pipe(busboy);
	}
	catch(err){
		res.send({error: err && err.message || err || "Unable to complete the operation"})
	}
}

async function getAlbums(req, res) {
	try {
		const data = await Album.find().sort('-created').lean().exec();
		res.send(data);
	}
	catch(err){
		res.send({error: err && err.message || err || "Unable to complete the operation"})
	}
}


module.exports = {
	createAlbum,
	addPictureToAlbum,
	getAlbums
};
