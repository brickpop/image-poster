// const Promise = require('bluebird');
// const ObjectId = require('mongoose').Types.ObjectId;

// const User = require('../models/user.js');
const Album = require('../models/album.js');

///////////////////////////////////////////////////////////////////////////////
// USERS
///////////////////////////////////////////////////////////////////////////////

// async function listUsers(req, res) {
// 	const perPage = parseInt(req.query._perPage || '30');
// 	const start = (parseInt(req.query._page || '1') - 1) * perPage;
// 	const sortBy = (req.query._sortDir != 'DESC' ? '' : '-') + (req.query._sortField || 'nom');

// 	const filters = JSON.parse(req.query._filters || '{}');
// 	if(filters.fullName) filters.fullName = new RegExp(filters.fullName, 'i');

// 	const count = await User.count(filters).exec();
// 	res.set("X-Total-Count", count);

// 	const data = await User.find(filters).sort(sortBy).skip(start).limit(perPage).lean().exec();
// 	res.send(data);
// }

// async function getUser(req, res) {
// 	if (!req.params.id) return res.status(404).send({});

// 	const data = await User.findById(req.params.id).lean().exec();
// 	if (!data) return res.send({error: 'The resource does not exist'});

// 	res.send(data);
// }

// async function addUser(req, res) {
// 	// CHECK PRIVILEGIS
// 	if(!req.user || !req.user.admin) return res.status(403).send({error: "Unable to complete the action"});

// 	const data = await User.create(req.body);
// 	if (!data) return res.status(500).send({error: 'The resource does not exist'});
// 	res.send(data);
// }

// async function updateUser(req, res) {
// 	if (!req.params.id) return res.status(404).send({});

// 	// CHECK PRIVILEGIS
// 	if(!req.user || !req.user.admin) return res.status(403).send({error: "Unable to complete the action"});

// 	const data = await User.findByIdAndUpdate(req.params.id, req.body).lean().exec();
// 	if (!data) return res.status(404).send({error: 'The resource does not exist'});
// 	res.send({});
// }

// async function removeUser(req, res) {
// 	// CHECK PRIVILEGIS
// 	if(!req.user || !req.user.admin) return res.status(403).send({error: "Unable to complete the action"});

// 	const data = await User.findByIdAndRemove(req.params.id).exec();
// 	if (!data) return res.status(404).send({});
// 	res.send();
// }

///////////////////////////////////////////////////////////////////////////////
// ALBUMS
///////////////////////////////////////////////////////////////////////////////

async function listAlbums(req, res) {
	const perPage = parseInt(req.query._perPage || '30');
	const start = (parseInt(req.query._page || '1') - 1) * perPage;
	const sortBy = (req.query._sortDir != 'DESC' ? '' : '-') + (req.query._sortField || 'nom');

	const filters = JSON.parse(req.query._filters || '{}');

	const count = await Album.count(filters).exec();
	res.set("X-Total-Count", count);

	const data = await Album.find(filters).sort(sortBy).skip(start).limit(perPage).lean().exec();
	res.send(data);
}

async function getAlbum(req, res) {
	if (!req.params.id) return res.status(404).send({});

	const data = await Album.findById(req.params.id).lean().exec();
	if (!data) return res.send({error: 'The resource does not exist'});

	res.send(data);
}

async function addAlbum(req, res) {
	// CHECK PRIVILEGIS
	if(!req.user) return res.status(403).send({error: "Unable to complete the action"});
	if(req.user.admin) {
		req.body.creator = req.user._id;

		const data = await Album.create(req.body);
		if (!data) return res.status(500).send({error: 'The resource does not exist'});
		res.send(data);
	}
	else {
		res.status(401).send("Not allowed");
	}
}

async function updateAlbum(req, res) {
	// CHECK PRIVILEGIS
	if(req.user.admin) {
		let data = await Album.findByIdAndUpdate(req.params.id, req.body).lean().exec();
		if (!data) return res.status(404).send({error: 'The resource does not exist'});
		res.send({});
	}
	else {
		res.status(401).send("Not allowed");
	}
}

async function removeAlbum(req, res) {
	// CHECK PRIVILEGIS
	if(req.user.admin) {
		let data = await Album.findByIdAndRemove(req.params.id).lean().exec();
		if (!data) return res.status(404).send({error: 'The resource does not exist'});
		res.send({});
	}
	else {
		res.status(401).send("Not allowed");
	}
}

///////////////////////////////////////////////////////////////////////////////
// SUMMARY
///////////////////////////////////////////////////////////////////////////////

async function getSummary(req, res) {
	const result = {
		// users: await User.count(),
		albums: await Album.count(),
		// departments: await Department.count(),
	};

	res.send(result);
}


module.exports = {
	// listUsers,
	// getUser,
	// addUser,
	// updateUser,
	// removeUser,

	listAlbums,
	getAlbum,
	addAlbum,
	updateAlbum,
	removeAlbum,

	getSummary
};
