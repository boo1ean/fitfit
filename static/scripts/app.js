'use strict';

angular.module('fitApp', ['ngRoute', 'ngTouch', 'angularMoment', 'fitApp.services', 'truncate']).
	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider.
			when('/', {
			templateUrl: '/partials/index.html',
			controller: 'IndexCtrl'
		}).
			when('/workouts-history', {
			templateUrl: '/partials/workouts-history.html',
			controller: 'WorkoutsHistoryCtrl'
		}).
			when('/workouts-start/:id', {
			templateUrl: '/partials/workouts-start.html',
			controller: 'WorkoutsStartCtrl'
		}).
			when('/workouts/:id', {
			templateUrl: '/partials/workout-details.html',
			controller: 'WorkoutDetailsCtrl'
		}).
			when('/exercises', {
			templateUrl: '/partials/exercises.html',
			controller: 'ExercisesCtrl'
		}).
			when('/exercises/:id', {
			templateUrl: '/partials/exercises-add.html',
			controller: 'ExercisesAddCtrl'
		}).
			when('/exercises/:id/stats', {
			templateUrl: '/partials/exercise-stats.html',
			controller: 'ExerciseStatsCtrl'
		}).
			when('/login', {
			templateUrl: '/partials/login.html',
			controller: 'LoginCtrl'
		}).
			when('/register', {
			templateUrl: '/partials/login.html',
			controller: 'RegisterCtrl'
		}).
			when('/stats', {
			templateUrl: '/partials/stats.html',
			controller: 'StatsCtrl'
		}).
			otherwise({
			redirectTo: '/'
		});

		$locationProvider.html5Mode(true);
	}]);
