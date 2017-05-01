module.exports = ['$q', '$injector', 'notification', function($q, $injector, notification) {
    return {
        'responseError': function(rejection) {
            if(rejection.data && rejection.data.error) {
                notification.log(rejection.data.error, { addnCls: 'humane-flatty-error' });
								// return $q.reject(rejection);
            }
            else if (rejection.status === 401) {
                notification.log('Inicia sesión para continuar', { addnCls: 'humane-flatty-default' });
                $injector.get('$state').go('login');
								// return $q.reject(rejection);
            }
            else if (rejection.status === 403) {
                notification.log('Inicia sesión para continuar', { addnCls: 'humane-flatty-default' });
                $injector.get('$state').go('login');
								// return $q.reject(rejection);
            }
            else if (rejection.status === 404) {
                notification.log('No se encuentra', { addnCls: 'humane-flatty-error' });
                // $injector.get('$state').go('dashboard');
								// return $q.resolve(rejection);
            }
            else {
              notification.log('No se puede completar la petición', { addnCls: 'humane-flatty-error' });
							// Replace response with rejected promise to prevent rest of execution
							return $q.reject(rejection);
						}
        }
    };
}];
