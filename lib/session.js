const config = require('../config/server');
const jwt = require('jsonwebtoken');

// hard
function enforceAuth(req, res, next) {
	var token;
  if(req.cookies && req.cookies.userToken) token = req.cookies.userToken;
	else return res.status(403).send({url: '#/dashboard'});

	// decode
	try {
		const payload = jwt.verify(token, config.JWT_SECRET, {});
		if(typeof payload != 'object' || !payload._id){
			return res.status(403).send({url: '#/dashboard'});
		}
		req.user = payload;
		next();
	}
	catch(err){
		return res.send({error: "No autoritzat"});
	}
}

// soft
function decodeAuth(req, res, next) {
	var token;
  if(req.cookies && req.cookies.userToken) token = req.cookies.userToken;
	else {
		req.user = {};
		return next();
	}

	// decode
	try {
		const payload = jwt.verify(req.cookies.userToken, config.JWT_SECRET, {});
		if(typeof payload != 'object' || !payload._id) {
			req.user = {};
			return next();
		}
		req.user = payload;
		next();
	}
	catch(err){
		req.user = {};
		next();
	}
}

function setSession(res, user){
	if(!res || !res.cookie) return console.error("Invalid res object supplied to setSession");

	const userPayload = {
		_id: user._id,
		admin: user.admin,
		email: user.email,
		fullName: user.fullName,
		lastName: user.lastName,
		name: user.name
	};
	const token = jwt.sign(userPayload || {}, config.JWT_SECRET, { expiresIn: config.SESSION_MAX_AGE / 1000 });

	res.cookie('userToken', token, { maxAge: config.SESSION_MAX_AGE, httpOnly: !config.DEBUG, secure: !config.DEBUG });
	return token;
}

function clearSession(res){
  if(res && res.clearCookie) res.clearCookie("userToken");
}



module.exports = {
	enforceAuth,
	decodeAuth,
	setSession,
	clearSession
};
