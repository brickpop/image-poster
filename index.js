'use strict';

// Override .babelrc
require("babel-register")({
  presets: ["es2017-node7", "react", "stage-1"],
  plugins: ["transform-decorators-legacy"]
});

const config = require('./config/server');
const express = require('express');
const basicAuth = require('basic-auth');
const serveStatic = require('serve-static');
const favicon = require('serve-favicon');
const throttle = require('lodash.throttle');

var mongoose = require('mongoose');
global.Promise = require('bluebird');
mongoose.Promise = Promise;
const api = require('./api');
const reactApp = require('./src/web/server.jsx');

var disconnecting = false;

// MAIN ROUTINE
function startServer(){
	initTerminationHandlers();

	startDatabase()
	.then(() => {
		var server = express();

		if(config.ALLOW_CORS) {
				server.use(function(req, res, next){
						res.setHeader('Access-Control-Allow-Origin', '*');
						next();
				});
		}
		// HTTP AUTH?
		if(config.HTTP_USER && config.HTTP_PASSWORD){
			console.log((new Date()).toJSON() + " | " + config.APP_NAME + " using HTTP Auth", "\n");
			server.use(function(req, res, next){
				const credentials = basicAuth(req);

				if(!credentials || credentials.name !== config.HTTP_USER || credentials.pass !== config.HTTP_PASSWORD) {
					res.setHeader('WWW-Authenticate', `Basic realm="${config.APP_NAME}"`)
					res.status(401).end('Unauthorized');
				}
				else next();
			});
		}

		server.use(api);
		server.use(serveStatic(__dirname + "/build", {'index': ['index.html']}));
		server.use(favicon(__dirname + '/build/media/favicon.ico'));
		server.use(reactApp);

		server.listen(config.HTTP_PORT, function() {
			console.log((new Date()).toJSON() + " | " + config.APP_NAME + " listening on port " + config.HTTP_PORT);
		});
	});
}

// MONGODB START
function startDatabase(){
	if(!config.MONGODB_URI) return Promise.resolve();

	return Promise.try(() => {
		// MongoDB Event Handlers
		mongoose.connection.on('connecting', onDbConnecting);
		mongoose.connection.on('connected', onDbConnected);
		mongoose.connection.once('open', onDbConnectionOpen);
		mongoose.connection.on('reconnected', onDbReconnected);
		mongoose.connection.on('error', throttle(onDbConnectionError, 1000, {leading: true}));
		mongoose.connection.on('disconnected', throttle(onDbDisconnected, 1000, {leading: true}));

		// Connect
		return mongoose.connect(config.MONGODB_URI, {server: {auto_reconnect:true}});
	})
	.catch(err => {
		console.error(`${config.APP_NAME} can't start because the MongoDB Server is not available`);
		console.error(err && err.message || err);
		process.exit(1);
	});
}

function onDbConnecting(){
	console.log('Connecting to MongoDB...') ;
}
function onDbConnected(){
	console.log('MongoDB connected') ;
}
function onDbConnectionOpen(){
	console.log('MongoDB connection opened') ;
}
function onDbReconnected(){
	console.log('MongoDB reconnected') ;
}

function onDbConnectionError(error) {
	console.error('Error in MongoDB connection: ' + error);
	mongoose.disconnect();
}
function onDbDisconnected() {
	if(disconnecting) {
		console.log('MongoDB connection closed');
	}
	else {
		console.error('MongoDB disconnected!\n');
		mongoose.connect(config.MONGODB_URI, {server: {auto_reconnect:true}})
		.catch(err => console.error(err && err.message || err));
	}
}

// TERMINATION HANDLERS
function initTerminationHandlers(){
	process.on('exit', code => console.log(`${config.APP_NAME} is about to exit (code ${code})`));

	var signals = ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
		'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGTERM' //, 'SIGUSR2'
	];

	// Removed 'SIGPIPE' from the list - bugz 852598.
	signals.forEach(signal => {
		process.on(signal, () => {
			console.log(`Received ${signal}...`);

			disconnecting = true;
			mongoose.disconnect()
			.then(() => {
				process.exit(2);
			});
		});
	});
}

// INIT
startServer();
