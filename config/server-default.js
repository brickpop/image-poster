module.exports = {
	DEBUG: true,
	APP_NAME: 'Image Poster',
	HTML_TITLE: 'YOUR APP',
	DOMAIN: 'your.domain.com',

	HTTP_PORT: process.env.PORT || (process.env.NODE_ENV != 'production' ? 3000 : 8080),
	SESSION_MAX_AGE: 1000 * 60 * 60 * 24 * 6, // 1 day

	STORAGE_FOLDER: "/tmp/changeme", // CHANGE THIS TO YOUR DESIRED PATH

	// GOOGLE_CLIENT_ID: 'xxxxx-xxxxxxxxxx.apps.googleusercontent.com',
	// GOOGLE_CLIENT_SECRET: 'xxxxxx',
	// GOOGLE_CLIENT_REDIRECT_URL: 'http://localhost:8080/api/oauth/callback',

	MONGODB_URI: 'mongodb://localhost:27017/poster',

	// JWT_SECRET: 'YOUR SECRET HERE',

	HTTP_USER: '',
	HTTP_PASSWORD: ''
};
