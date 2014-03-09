'use strict';

angular.module('fitApp').
	controller('IndexCtrl', function($scope) {

	}).

	controller('WorkoutsHistoryCtrl', function($scope, storage) {
		$scope.workouts = storage.workouts();
	}).

	controller('WorkoutsStartCtrl', function($scope, $window, $location, $interval, storage) {
		var warning = function() {
			return 'Тренеровка еще не закончена. Вы уверенных что хотите завершить сейчас?'
		};

		$window.onbeforeunload = warning;

		$scope.current = {};
		$scope.adding = false;
		$scope.exercises = storage.exercises();
		$scope.currentTime = new Date();
		$scope.workout = {
			startTime: new Date(),
			exercises: []
		};

		var interval = $interval(function() {
			$scope.currentTime = new Date();
		}, 1000);

		$scope.unsetExercise = function() {
			delete $scope.current.exercise;
		};

		$scope.addExercise = function(exercise) {
			$scope.workout.exercises.unshift(exercise);
			$scope.adding = false;
			$scope.current = {};
		};

		$scope.finish = function() {
			if (confirm('Завершить тренеровку?')) {
				storage.addWorkout($scope.workout);
				$location.path('/');
			}
		};
	}).

	controller('ExercisesCtrl', function($scope, $window, storage) {
		$window.moment.lang('ru');
		$scope.exercises = storage.exercises();

		$scope.remove = function(exercise) {
			$scope.exercises = storage.removeExercise(exercise);
		};
	}).

	controller('ExercisesAddCtrl', function($scope, $location, storage) {
		$scope.exercise = {};

		$scope.save = function(exercise) {
			storage.addExercise(exercise);
			$location.path('/exercises');
		}
	});
