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

		$scope.addExercise = function(completedExercise) {
			$scope.exercises = storage.touchExercise(completedExercise.exercise.id);
			$scope.workout.exercises.unshift(completedExercise);
			$scope.adding = false;
			$scope.current = {};
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
			if (confirm('Удалить упражнение?')) {
				$scope.exercises = storage.removeExercise(exercise);
			};
		};
	}).

	controller('ExercisesAddCtrl', function($scope, $location, storage) {
		$scope.exercise = {};

		$scope.save = function(exercise) {
			storage.addExercise(exercise);
			$location.path('/exercises');
		}
	});
