'use strict';

angular.module('fitApp').
	directive('ngOneOf', function() {
		return {
			templateUrl: 'partials/directives/one-of.html',
			link: function($scope, $el) {
				$scope.selected = null;
				$scope.items = [
					{ label: 50, value: 50 },
					{ label: 55, value: 55 },
					{ label: 60, value: 60 }
				];

				$scope.select = function(item) {
					$scope.selected = item;
				};
			}
		};
	});
