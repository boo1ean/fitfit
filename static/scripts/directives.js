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
	}).

	directive('swipeAction', ['$swipe', '$timeout', '$sce',
		function($swipe, $timeout, $sce) {
		return {
			transclude: true,

			template: '<div class="item-swipe-wrapper" style="position: relative">' +
				'<div class="swipe-action swipe-action-left" ng-show="leftLabel" ng-bind-html="leftLabel"></div>' +
				'<div class="swiper" ng-transclude style="position: relative"></div>' +
				'<div class="swipe-action swipe-action-right" ng-show="rightLabel" ng-bind-html="rightLabel"></div>' +
				'</div>',

			link: {
				post: function postLink(scope, el, attrs) {
					var startCoords,
					    restrictRight = false,
					    restrictLeft = false,
					    $swiper = angular.element('.swiper', el);

					scope.proceed = false;
					scope.leftLabel = $sce.trustAsHtml(attrs.leftLabel);
					scope.rightLabel = $sce.trustAsHtml(attrs.rightLabel);

					var isCompleted = function(coords) {
						var diff = coords.x - startCoords.x;
						var actionWidth = $swiper.width() / 3.5;
						return Math.abs(diff) >= actionWidth ? diff : 0;
					}

					function updateElementPosition(pos) {
						$swiper.css('left', pos);
					}

					scope.$watch('proceed', function(val) {
						if (val < 0) {
							scope.$eval(attrs.onSwipeLeft);
						} else if (val > 0) {
							scope.$eval(attrs.onSwipeRight);
						}

						updateElementPosition(0);
					});

					$swipe.bind($swiper, {
						'start': function(coords) {
							restrictRight = !attrs.onSwipeRight;
							restrictLeft = !attrs.onSwipeLeft;
							startCoords = coords;
						},

						'move': function(coords) {
							var diff = coords.x - startCoords.x;

							if (restrictLeft && diff < 0 || restrictRight && diff > 0) {
								return;
							}

							updateElementPosition(diff);
						},

						'end': function(endCoords) {
							scope.$apply(function() {
								scope.proceed = isCompleted(endCoords);
								updateElementPosition(0);
							});
						}
					});
				}
			}
		};
	}]);
