'use strict';

angular.module('fitApp').
	controller('IndexCtrl', function($scope) {

	}).

	controller('ExercisesCtrl', function($scope) {
		$scope.exercises = [
			{
				name: 'Жим ногами',
				type: 'repeatable'
			},
			{
				name: 'Жим от груди лёжа',
				type: 'repeatable'
			},
			{
				name: 'Бег',
				type: 'continuable'
			}
		];
	}).

	controller('ExercisesAddCtrl', function($scope, storage) {
		console.log(storage);
	});
