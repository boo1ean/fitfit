'use strict';

angular.module('fitApp').
	controller('IndexCtrl', function($scope) {

	}).

	controller('WorkoutsStartCtrl', function($scope, $window, $location, storage) {
		var warning = function() {
			return 'Тренеровка еще не закончена. Вы уверенных что хотите завершить сейчас?'
		};

		$window.onbeforeunload = warning;

		$scope.current = {};
		$scope.adding = false;
		$scope.exercises = storage.exercises();

		$scope.unsetExercise = function() {
			delete $scope.current.exercise;
		};

		$scope.addExercise = function(exercise) {
			console.log(exercise);
			$scope.adding = false;
			$scope.current = {};
		};

		$scope.finish = function() {
			if (confirm('Завершить тренеровку?')) {
				$location.path('/');
			}
		};
	}).

	controller('ExercisesCtrl', function($scope, storage) {
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
