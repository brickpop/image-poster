const config = require('../config/server');
const Promise = require('bluebird');
const mongoose = require('mongoose');
global.Promise = require('bluebird');
mongoose.Promise = Promise;
const throttle = require('lodash.throttle');

const Album = require('../models/album.js');

if(!config.DEBUG) {
	console.error("Populate will not run in production");
	process.exit(1);
}


function populate(){
	startDatabase()
	.then(yourCodeHere)
	.then(() => {
		mongoose.disconnect();
		// console.log("User ID's", userIDs);
		console.log("DONE");
	})
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
}

function startDatabase(){
	if(!config.MONGODB_URI) return Promise.resolve();

	return Promise.try(() => {
		mongoose.connection.on('connecting', () => console.log('Connecting'));
		mongoose.connection.on('connected', () => console.log('Connected'));
		mongoose.connection.once('open', () => console.log('Connection open'));
		mongoose.connection.on('reconnected', () => console.log('Reconnected'));
		mongoose.connection.on('error', throttle(console.error, 1000, {leading: true}));
		mongoose.connection.on('disconnected', throttle(console.error, 1000, {leading: true}));
		return mongoose.connect(config.MONGODB_URI, {server: {auto_reconnect:true}});
	})
	.catch(err => {
		console.error(`${config.APP_NAME} can't start because the MongoDB Server is not available`);
		console.error(err && err.message || err);
		process.exit(1);
	});
}

async function yourCodeHere(){
	// Your code here
}

// MAIN

populate();
