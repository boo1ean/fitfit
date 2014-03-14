'use strict';

angular.module('fitApp').
	controller('IndexCtrl', function($scope) {

	}).

	controller('WorkoutsHistoryCtrl', function($scope, $location, storage) {
		$scope.workouts = storage.workouts();

		$scope.show = function(workout) {
			$scope.$apply(function() {
				$location.path('/workouts/' + workout.id);
			});
		};

		$scope.continue = function(workout) {
			$location.path('/workouts-start/' + workout.id);
		};

		$scope.remove = function(workout) {
			$scope.workouts = storage.removeWorkout(workout);
		};
	}).

	controller('WorkoutsStartCtrl', function($scope, $window, $location, $interval, $routeParams, storage) {
		var warning = function() {
			return 'Тренеровка еще не закончена. Вы уверенных что хотите завершить сейчас?'
		};

		$window.onbeforeunload = warning;

		$scope.current = null;
		$scope.adding = false;
		$scope.exercises = storage.exercises();
		$scope.currentTime = new Date();

		var workout, id = $routeParams.id - 0;
		if (angular.isNumber(id) && (workout = storage.findWorkout(id))) {
			$scope.workout = workout;
		} else {
			$scope.workout = storage.addWorkout({
				startTime: new Date(),
				endTime: new Date(),
				exercises: []
			});
		}

		var interval = $interval(function() {
			$scope.workout.endTime = new Date();
			storage.updateWorkout($scope.workout);
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
			var times = prioritize(ex.times, ex.completedTimes);
			var weights = prioritize(ex.weights, ex.completedWeight);

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

		var copyExercise = function(exercise) {
			exercise = angular.copy(exercise);
			exercise.created_at = new Date().getTime();
			exercise.updated_at = new Date().getTime();
			return exercise;
		};

		$scope.$watch('current', function(current) {
			if (current && current.completedWeight && current.completedTimes && current.difficult) {
				addExercise(current);
			}
		}, true);

		$scope.selectExercise = function(exercise) {
			$scope.current = copyExercise(exercise);
		};

		$scope.repeatExercise = function(exercise) {
			addExercise(copyExercise(exercise));
		};

		$scope.removeExercise = function(exercise) {
			for (var i in $scope.workout.exercises) {
				if ($scope.workout.exercises[i].id === exercise.id) {
					$scope.workout.exercises.splice(i, 1);
					return;
				}
			}
		};

		$scope.finish = function() {
			if (confirm('Завершить тренеровку?')) {
				$interval.cancel(interval);
				$scope.workout.endTime = new Date();
				storage.updateWorkout($scope.workout);
				$window.onbeforeunload = null;
				$location.path('/');
			}
		};
	}).

	controller('WorkoutDetailsCtrl', function($scope, $routeParams, storage) {
		var workout = $scope.workout = storage.findWorkout($routeParams.id);
		$scope.exercisesCount = _.unique(workout.exercises, 'id').length;
		$scope.totalWeight = _.reduce(workout.exercises, function(result, ex) {
			result += ex.completedTimes * ex.completedWeight;
			return result;
		}, 0);

		$scope.duration = moment.duration(workout.endTime - workout.startTime);
	}).

	controller('ExercisesCtrl', function($scope, $window, $location, storage) {
		$window.moment.lang('ru');
		$scope.exercises = storage.exercises();

		$scope.remove = function(exercise) {
			$scope.exercises = storage.removeExercise(exercise);
		};

		$scope.edit = function(exercise) {
			$location.path('/exercises/' + exercise.id);
		};
	}).

	controller('ExercisesAddCtrl', function($scope, $location, $routeParams, storage) {
		var id = $routeParams.id - 0;
		$scope.exercise = angular.isNumber(id) ? storage.findExercise(id) : {};

		console.log($scope.exercise);

		$scope.save = function(exercise) {
			console.log(exercise);
			if (exercise.id) {
				storage.updateExercise(exercise);
			} else {
				storage.addExercise(exercise);
			}

			$location.path('/exercises');
		}
	});
