'use strict';

angular.module('fitApp', ['ngRoute', 'ngTouch', 'fitApp.services']).
	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider.
			when('/', {
			templateUrl: 'partials/index.html',
			controller: 'IndexCtrl'
		}).
			when('/workouts-history', {
			templateUrl: 'partials/workouts-history.html',
			controller: 'WorkoutsHistoryCtrl'
		}).
			when('/workouts-start', {
			templateUrl: 'partials/workouts-start.html',
			controller: 'WorkoutsStartCtrl'
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
