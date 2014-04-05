'use strict';

angular.module('fitApp').
	controller('IndexCtrl', function($scope, $window, $http, storage) {
		$scope.user = $window.user;

		$scope.save = function() {
			if (confirm('Точно положить?')) {
				var data = storage.serialize();
				$http.post('/data', data).success(function() {
					alert('Успех');
				});
			}
		};

		$scope.get = function() {
			if (confirm('Точно взять?')) {
				$http.get('/data').success(function(data) {
					storage.load(data);
					alert('Успех');
				});
			}
		};
	}).

	controller('WorkoutsHistoryCtrl', function($scope, $location, storage) {
		$scope.workouts = storage.workouts();

		$scope.cleanUp = function() {
			if (confirm('Точно почистить?')) {
				var workouts = storage.workouts();
				for (var i in workouts) {
					if (!workouts[i].exercises.length) {
						storage.removeWorkout(workouts[i]);
					}
				}

				$scope.workouts = storage.workouts();
			}
		};

		$scope.show = function(workout) {
			$scope.$apply(function() {
				$location.path('/workouts/' + workout.id);
			});
		};

		$scope.continue = function(workout) {
			$location.path('/workouts-start/' + workout.id);
		};

		$scope.remove = function(workout) {
			if (confirm('Вы уверены?')) {
				$scope.workouts = storage.removeWorkout(workout);
			}
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
			if (confirm('Вы уверены?')) {
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

		$scope.stats = function(exercise) {
			$scope.$apply(function() {
				$location.path('/exercises/' + exercise.id + '/stats');
			});
		};

		$scope.remove = function(exercise) {
			if (confirm('Вы уверены?')) {
				$scope.exercises = storage.removeExercise(exercise);
			}
		};

		$scope.edit = function(exercise) {
			$location.path('/exercises/' + exercise.id);
		};
	}).

	controller('RegisterCtrl', function($scope, $http, $window, $location) {
		$scope.user = {};

		$scope.clear = function() {
			$scope.required = false;
			$scope.error = false;
		};

		$scope.submit = function(user) {
			$scope.clear();

			if (!user.email || !user.password) {
				return $scope.required = true;
			}

			$http.post('/register', user)
				.success(function(result) {
					if (result.errors) {
						$scope.error = result.errors.email;
					} else {
						$location.path('/login');
					}
				});
		};
	}).

	controller('LoginCtrl', function($scope, $http, $window, $location) {
		$scope.user = {};

		$scope.clear = function() {
			$scope.required = false;
			$scope.error = false;
		};

		$scope.submit = function(user) {
			$scope.clear();

			if (!user.email || !user.password) {
				return $scope.required = true;
			}

			$http.post('/login', user)
				.success(function(result) {
					if (result.errors) {
						$scope.error = result.errors.email;
					} else {
						$window.user = result;
						$location.path('/');
					}
				});
		};
	}).

	controller('ExerciseStatsCtrl', function($scope, $routeParams, storage) {
		var exerciseId = $routeParams.id;
		var stats = storage.findExerciseStats(exerciseId);

		$scope.exercise = stats[0];

		_.each(stats, function(ex) {
			ex.power = ex.completedTimes * ex.completedWeight;
			ex.time = moment(ex.created_at).format('YYYY-MM-DD');
		});

		var data = _.values(_.groupBy(stats, 'time'));

		_.each(data, function(items, i) {
			items = items.reverse();
			_.each(items, function(item, i) {
				item.index = i;
			});
		});

		var margin = {top: 20, right: 20, bottom: 30, left: 40},
			width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		var x0 = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);

		var x1 = d3.scale.ordinal();

		var y = d3.scale.linear()
			.range([height, 0]);

		var dates = d3.scale.ordinal()
			.range([0, width]);

		var xAxis = d3.svg.axis()
			.scale(x0)
			.orient('bottom');

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
			.tickFormat(d3.format('.2s'));

		var svg = d3.select('.chart-container')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		var times = _.unique(_.pluck(stats, 'time')).reverse();
		var numberDomain = _.range(0, d3.max(data, function(d) { return d.length; }));
		var maxPower = d3.max(stats, function(d) { return d.power; });

		data = _.map(data, function(items) {
			if (items.length < numberDomain.length) {
				items = items.concat(_.range(items.length, numberDomain.length).map(function(index) {
					return {
						time: items[0].time,
						power: maxPower,
						index: index,
						difficult: 42
					};
				}));
			}

			return items;
		});

		x0.domain(times);
		x1.domain(numberDomain).rangeRoundBands([0, x0.rangeBand()]);
		y.domain([0, maxPower]);

		svg.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(xAxis);

		svg.append('g')
			.attr('class', 'y axis')
			.call(yAxis)
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', 6)
			.attr('dy', '.71em')
			.style('text-anchor', 'end')
			.text('Выхлоп');

		var date = svg.selectAll('.exercise')
			.data(data)
			.enter()
			.append('g')
			.attr('class', 'exercise-date-group')
			.attr('transform', function(d) { return 'translate(' + x0(d[0].time) + ',0)'; });

		date.selectAll('rect')
			.data(function(d) { return d; })
			.enter()
			.append('rect')
			.attr('width', x1.rangeBand())
			.attr('x', function(d) { return x1(d.index); })
			.attr('y', function(d) { return y(d.power); })
			.attr('height', function(d) { return height - y(d.power); })
			.attr('class', function(d) { return 'exercise di-fill-' + d.difficult; });
	}).

	controller('ExercisesAddCtrl', function($scope, $location, $routeParams, storage) {
		var id = $routeParams.id - 0;
		$scope.exercise = angular.isNumber(id) ? storage.findExercise(id) : {};

		$scope.save = function(exercise) {
			if (exercise.id) {
				storage.updateExercise(exercise);
			} else {
				storage.addExercise(exercise);
			}

			$location.path('/exercises');
		}
	});
