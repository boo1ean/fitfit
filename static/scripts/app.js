'use strict';

angular.module('fitApp', ['ngRoute', 'ngTouch', 'fitApp.services']).
	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider.
			when('/', {
			templateUrl: 'partials/index.html',
			controller: 'IndexCtrl'
		}).
			when('/exercises', {
			templateUrl: 'partials/exercises.html',
			controller: 'ExercisesCtrl'
		}).
			when('/exercises-add', {
			templateUrl: 'partials/exercises-add.html',
			controller: 'ExercisesAddCtrl'
		}).
			otherwise({
			redirectTo: '/'
		});

		$locationProvider.html5Mode(true);
	}]);
