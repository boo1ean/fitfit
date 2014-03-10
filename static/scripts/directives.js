'use strict';

angular.module('fitApp').
	directive('ngOneOf', function() {
		return {
			templateUrl: 'partials/directives/one-of.html',

			scope: {
				items: '=',
				obj: '=obj',
				prop: '@'
			},

			link: function(scope) {
				scope.select = function(item) {
					scope.obj[scope.prop] = item;
				};
			}
		};
	});
