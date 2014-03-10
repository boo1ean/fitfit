'use strict';

angular.module('fitApp').
	directive('ngOneOf', function() {
		return {
			templateUrl: 'partials/directives/one-of.html',

			scope: {
				items: '=',
				prop: '=prop',
				label: '@'
			},

			link: function(scope) {
				scope.select = function(item) {
					scope.prop = item;
					scope.custom = scope.customValue = null;
				};
			}
		};
	});
