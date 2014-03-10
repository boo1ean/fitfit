'use strict';

angular.module('fitApp').
	controller('IndexCtrl', function($scope) {

	}).

	controller('WorkoutsHistoryCtrl', function($scope, $window, storage) {
		$scope.workouts = storage.workouts();

		$scope.remove = function(workout) {
			if ($window.confirm('Удалить запись о тренеровке')) {
				$scope.workouts = storage.removeWorkout(workout);
			};
		};
	}).

	controller('WorkoutsStartCtrl', function($scope, $window, $location, $interval, storage) {
		var warning = function() {
			return 'Тренеровка еще не закончена. Вы уверенных что хотите завершить сейчас?'
		};

		//$window.onbeforeunload = warning;

		$scope.current = null;
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
			$scope.current = null;
		};

		var limit = 4;
		var prioritize = function(array, item) {
			var index;
			array = angular.isArray(array) ? array : [];

			if ((index = array.indexOf(item)) !== -1) {
				array.splice(index, 1)
				array.unshift(item);
			} else {
				array = array.slice(0, limit);
				array.unshift(item);
			}

			return array;
		};

		var adjustExercise = function(ex) {
			var times = prioritize(ex.times, ex.completed_times);
			var weights = prioritize(ex.weights, ex.completed_weight);

			$scope.exercises = storage.updateExercise(ex.id, {
				times: times,
				weights: weights,
				accessed_at: new Date().getTime()
			});
		};

		var addExercise = function(completedExercise) {
			adjustExercise(completedExercise);
			$scope.workout.exercises.unshift(completedExercise);
			$scope.adding = false;
			$scope.current = null;
		};

		$scope.$watch('current', function(current) {
			if (current && current.completed_weight && current.completed_times) {
				addExercise(current);
			}
		}, true);

		$scope.selectExercise = function(exercise) {
			$scope.current = angular.copy(exercise);
			$scope.current.created_at = new Date().getTime();
			$scope.current.updated_at = new Date().getTime();
		};

		$scope.removeExercise = function(exercise) {
			if (confirm('Удалить подход?')) {
				for (var i in $scope.workout.exercises) {
					if ($scope.workout.exercises[i].id === exercise.id) {
						$scope.workout.exercises.splice(i, 1);
						return;
					}
				}
			}
		};

		$scope.finish = function() {
			if (confirm('Завершить тренеровку?')) {
				$scope.workout.endTime = new Date();
				storage.addWorkout($scope.workout);
				$window.onbeforeunload = null;
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
