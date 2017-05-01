module.exports = function($stateProvider){
	$stateProvider.state('summary', {
		parent: 'ng-admin',
		url: '/summary',
		controller: ['$stateParams', 'notification', '$http', controller],
		controllerAs: 'controller',
		template: require('./summary.html')
	});
};

function controller($stateParams, notification, $http) {
	var self = this;
	// this.postId = $stateParams.id;
	// notification is the service used to display notifications on the top of the screen
	self.notification = notification;

	self.loadResum = function(){
		$http.get('/api/admin/summary')
		.then(function(response) {
			self.summary = response.data;

		})
		.catch(function(){
			self.notification.log("Unable to connect to the server");
		});
	};

	// MAIN
	self.loadResum();
}

controller.inject = ['$stateParams', 'notification', '$http'];

// controller.prototype.sendEmail = function() {
// 	this.notification.log('Email successfully sent to ' + this.email);
// };
