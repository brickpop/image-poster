// const config = require('../config/router');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { enforceAuth } = require('../lib/session');

const {
	createAlbum,
	addPictureToAlbum,
	getAlbums
} = require('./web');

const {
	// listUsers,
	// getUser,

	listAlbums,
	getAlbum,
	addAlbum,
	updateAlbum,
	removeAlbum,

	getSummary
} = require('./admin');

const { oauthLogin, oauthAuthenticate, getSession, logout } = require('./auth');

const router = express.Router();
router.use(bodyParser.json({limit: '1mb'}));
router.use(cookieParser());

// API ROUTE LIST


///////////////////////////////////////////////////////////////////////////////
// ADMIN
///////////////////////////////////////////////////////////////////////////////

router.get('/api/admin/session', [ enforceAuth, getSession ]);
router.get('/api/admin/login', [ oauthLogin ]);
router.get('/api/admin/logout', [ logout ]);
router.post('/api/admin/logout', [ logout ]);

router.get('/api/admin/summary', [ enforceAuth, getSummary ]);

// router.get('/api/admin/users/:id', [ enforceAuth, getUser ]);
// router.get('/api/admin/users', [ enforceAuth, listUsers ]);
// router.post('/api/admin/users', [ enforceAuth, addUser ]);
// router.put('/api/admin/users/:id', [ enforceAuth, updateUser ]);
// router.delete('/api/admin/users/:id', [ enforceAuth, removeUser ]);

router.get('/api/admin/albums/:id', [ enforceAuth, getAlbum ]);
router.get('/api/admin/albums', [ enforceAuth, listAlbums ]);
router.post('/api/admin/albums', [ enforceAuth, addAlbum ]);
router.put('/api/admin/albums/:id', [ enforceAuth, updateAlbum ]);
router.delete('/api/admin/albums/:id', [ enforceAuth, removeAlbum ]);


///////////////////////////////////////////////////////////////////////////////
// WEB
///////////////////////////////////////////////////////////////////////////////

router.get('/api/web/albums', [ getAlbums ]);
router.post('/api/web/albums', [ createAlbum ]);
router.post('/api/web/albums/:id', [ addPictureToAlbum ]);

router.get('/api/web/login', [ oauthLogin ]);

///////////////////////////////////////////////////////////////////////////////
// GLOBAL
///////////////////////////////////////////////////////////////////////////////

router.get('/api/oauth/callback', [ oauthAuthenticate ]);


// Error handling
router.use(function(err, req, res, next){
	console.log(err);
	if(!err) return res.send('');
	res.status(500).send({error: err.message || err});
});

module.exports = router;
