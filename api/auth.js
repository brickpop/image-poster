const config = require('../config/server');
const google = require('googleapis');
const OAuth2Client = google.auth.OAuth2;

const { setSession, clearSession } = require('../lib/session');
const User = require('../models/user.js');

var scopes = [
	// 'https://www.googleapis.com/auth/plus.login',
	// 'https://www.googleapis.com/auth/plus.me',
	'https://www.googleapis.com/auth/userinfo.email',
	'https://www.googleapis.com/auth/userinfo.profile'
];

///////////////////////////////////////////////////////////////////////////////
// SESSION MANAGEMENT
///////////////////////////////////////////////////////////////////////////////

function oauthLogin(req, res) {
	if (req.url.indexOf('/api/admin/login') == 0) {
		res.cookie('returnTo', '/admin');
	}
	else {
		res.cookie('returnTo', '/');
	}

	const authClient = new OAuth2Client(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, config.GOOGLE_CLIENT_REDIRECT_URL);
	const url = authClient.generateAuthUrl({
		access_type: 'offline', // will return a refresh token
		scope: scopes
	});

	res.redirect(url);
}

function oauthAuthenticate(req, res) {
	if (!req.query.code) return res.redirect('/');

	const authClient = new OAuth2Client(config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, config.GOOGLE_CLIENT_REDIRECT_URL);
	authClient.getToken(req.query.code, function (err, tokens) {
		if (err) {
			console.error(new Date(), err);
			return res.send("Unable to sign up via Google");
		}

		authClient.setCredentials(tokens);
		google.oauth2("v2").userinfo.v2.me.get({ auth: authClient }, async (err, profile) => {
			if (err) {
				console.error(new Date(), err);
				return res.send("Unable to sign up via Google");
			}
			else if (!profile || !profile.id) {
				console.error(new Date(), 'Empty profile response', profile);
				return res.send("Unable to sign up via Google");
			}

			/* profile {
				id: '1234567890',
				email: 'user@email',
				verified_email: true,
				name: 'Jordi Moraleda',
				given_name: 'Jordi',
				family_name: 'Moraleda',
				link: 'https://plus.google.com/+UserName',
				picture: 'https://www/photo.jpg',
				gender: 'male',
				locale: 'ca'
			} */

			var user = await User.findOne({ oauthId: profile.id }).lean().exec();

			if (!user || !user._id) { // create
				user = await User.create({
					oauthId: profile.id,
					email: profile.email,
					fullName: profile.name || '',
					name: profile.given_name || '',
					lastName: profile.family_name || ''
				});
				user = user.toObject();
			}

			setSession(res, user);
			res.redirect(req.cookies && req.cookies.returnTo || '/');
		});
	});
}

function getSession(req, res) {
	res.send(req.user);
}

function logout(req, res) {
	clearSession(res);
	res.redirect('/');
}

module.exports = {
	oauthLogin,
	oauthAuthenticate,
	getSession,
	logout
};
