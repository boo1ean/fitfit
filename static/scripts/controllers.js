'use strict';

var IndexCtrl = function($scope) {

};

var ExercisesCtrl = function($scope) {
	$scope.exercies = [
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
};
