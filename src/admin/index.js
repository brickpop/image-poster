const angular = require('angular');

// CSS
// require('ng-admin/build/ng-admin.min.css');  // > Bundled in the Taskfile

var directivesInit = require('./directives');

// BOOTSTRAP THE ADMIN

var app = angular.module('admin', [ require('ng-admin') ]);

directivesInit(app);

app.factory('httpInterceptor', require('./factories/http-interceptor'));

app.config(['NgAdminConfigurationProvider', '$stateProvider', '$translateProvider', '$httpProvider', function(NgAdminConfigurationProvider, $stateProvider, $translateProvider, $httpProvider) {

	$httpProvider.interceptors.push('httpInterceptor');

	var nga = NgAdminConfigurationProvider;
	var admin = nga.application("Image Poster")
	.baseApiUrl("/api/admin/");

	// ENTITIES

	admin.addEntity(nga.entity('albums'));
	// admin.addEntity(nga.entity('users'));

	require('./entities/albums')(nga, admin);
	// require('./entities/users')(nga, admin);


	// PAGES
	require('./pages/summary')($stateProvider);

	admin.dashboard(require('./dashboard')(nga, admin));
	admin.header(require('./pages/header.html'));
	admin.menu(require('./menu')(nga, admin));

	// CONFIG
	nga.configure(admin);

	// LANGUAGE
	require('./lang')($translateProvider);
}]);

// used in header.html
app.controller('session', ['$rootScope', '$window', '$http', '$location', 'notification', function($rootScope, $window, $http, $location, notification) {
	$rootScope.session = null;
	$rootScope.loading = true;
	$rootScope.getSession = getSession;
	// $rootScope.login = login;
	$rootScope.logout = logout;

	function getSession(){
		$rootScope.loading = true;

		return $http.get('/api/admin/session')
		.then(response => {
			$rootScope.loading = false;
			if(response && response.data) $rootScope.session = response.data;
		})
		.catch(() => {
			$rootScope.loading = false;
			$location.path('/dashboard');
		})
	}

	// function login(username, password){
	// 	return $http.post('/api/admin/login', {username, password})
	// 	.then(response => {
	// 		if(response && response.data && response.data._id) {
	// 			$rootScope.session = response.data;
	// 			$location.path('/resum')
	// 		}
	// 		else if(response && response.data && response.data.error) {
	// 			notification.log(response && response.data && response.data.error || "No s'ha pogut iniciar sessió", { addnCls: 'humane-flatty-error' });
	// 		}
	// 		else {
	// 			return getSession()
	// 			.then(() => {
	// 				$location.path('/resum');
	// 			})
	// 		}
	// 	})
	// 	.catch(() => {
	// 		$location.path('/dashboard');
	// 	})
	// }

	function logout(){
		// $rootScope.loading = true;

		return $http.post('/api/admin/logout')
		.then(getSession)
		.then(() => {
			// $rootScope.loading = false;
			$rootScope.session = null;
			$location.path('/dashboard');
		})
		.catch(() => {
			// $rootScope.loading = false;
			$location.path('/dashboard')
		})
	}

	// $rootScope.session =  $window.localStorage.getItem('session');
	$rootScope.getSession();
}])
