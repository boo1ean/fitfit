'use strict';

angular.module('fitApp', ['ngRoute']).
	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider.
			when('/', {
			templateUrl: 'partials/index.html',
			controller: IndexCtrl
		}).
			when('/exercises', {
			templateUrl: 'partials/exercises.html',
			controller: ExercisesCtrl
		}).
			otherwise({
			redirectTo: '/'
		});

		$locationProvider.html5Mode(true);
	}]);
