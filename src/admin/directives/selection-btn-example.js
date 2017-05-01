module.exports = ['$http', '$q', 'notification', '$state', function($http, $q, notification, $state) {
  'use strict';

  return {
      restrict: 'E',
      scope: {
          selection: '='
      },
      link: function(scope, element, attrs) {
          scope.procrastinate = function() {
            $http.put('/api/tasks/procrastinate', {tasks: scope.selection.map(function(e){ return e.values._id; })} )
            .then(function(){ return $state.reload(); })
            .then(function(){ notification.log(scope.selection.length + ' tasques endarrerides', { addnCls: 'humane-flatty-success' }); } )
            .catch(function(e){ notification.log('No s\'ha pogut actualitzar les tasques', { addnCls: 'humane-flatty-error' }) && console.error(e); });
          }
      },
      template: '<span ng-click="procrastinate()"><span class="fa fa-clock-o" aria-hidden="true"></span> Més tard</a>'
  };
}];
