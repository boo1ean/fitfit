'use strict';

angular.module('fitApp').
	controller('IndexCtrl', function($scope) {

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
