module.exports = ['$http', '$q', 'notification', '$state', function($http, $q, notification, $state) {
	return {
		restrict: 'E',
		scope: { task: '&' },
		link: function (scope) {
			scope.state = scope.task().values.state;

			scope.markAsWorking = function () {
				$http.put('/api/tasks/' + scope.task().values._id + '/working')
				.then(function(response) {
					if(response.data && !response.data.error) {
						notification.log('Tasca marcada com a activa', { addnCls: 'humane-flatty-success' });
						$state.reload();
					}
					else notification.log(response.data.error || "No es pot completar l'acció", { addnCls: 'humane-flatty-error' });
				})
				.catch(function(){
					notification.log("No es pot connectar amb el servidor", { addnCls: 'humane-flatty-error' });
				});
			};
		},
		template: '<a ng-show="state != \'Working\'" class="btn btn-primary" ng-click="markAsWorking()"><span class="fa fa-pencil"></span> <span class="hidden-xs">Iniciar</span></a>'
	};
}];
