var template = require('./project-hours.html');

module.exports = ['$http', '$q', function($http, $q) {
	return {
		restrict: 'E',
		scope: {
      tasks: '&',
      project: '&'
    },
		link: function (scope) {
			scope.project = scope.project();
      var tasks = scope.tasks();
      var usersWork = {};

      tasks.forEach(function(task){
				if(!task.workPeriods) return;
				task.workPeriods.forEach(function(wp){
					var id = wp.owner || task.owners[0];
					if(!usersWork[id]) usersWork[id] = {
						user: id,
						time: 0
					};
					var diff = new Date(wp.to) - new Date(wp.from);
					usersWork[id].time += diff / 1000 / 60 / 60;
				});
      });

			scope.totalTime = 0;

			var proms = [];
			var p;
			for(var id in usersWork){
				p = $http.get('/api/users/' + usersWork[id].user)
				.then(function(response){
					scope.totalTime += usersWork[response.data._id].time;
					return {
						user: response.data,
						time: usersWork[response.data._id].time
					};
				});
				proms.push(p);
			}
			$q.all(proms)
			.then(function(works){
				scope.works = works;
			})
		},
		template: template
	};
}];
