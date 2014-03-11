'use strict';

angular.module('fitApp').
	directive('ngOneOf', function() {
		return {
			templateUrl: '/partials/directives/one-of.html',

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
					    swiped = false,
					    $swiper = angular.element('.swiper', el);

					scope.proceed = false;
					scope.leftLabel = $sce.trustAsHtml(attrs.leftLabel);
					scope.rightLabel = $sce.trustAsHtml(attrs.rightLabel);

					if (attrs.onClick) {
						$swiper.on('click', function() {
							if (!swiped) {
								scope.$eval(attrs.onClick);
							}

							swiped = false;
						});
					}

					var isCompleted = function(coords) {
						var diff = coords.x - startCoords.x;
						var actionWidth = $swiper.width() / 3.5;
						return Math.abs(diff) >= actionWidth ? diff : 0;
					};

					var isMax = function(diff) {
						var actionWidth = $swiper.width() / 3.333;
						return Math.abs(diff) >= actionWidth;
					};

					var isSwiped = function(coords) {
						var diff = coords.x - startCoords.x;
						return Math.abs(diff) > 10;
					};

					var updateElementPosition = function(pos) {
						$swiper.css('left', pos);
					};

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
							swiped = false;
							restrictRight = !attrs.onSwipeRight;
							restrictLeft = !attrs.onSwipeLeft;
							startCoords = coords;
						},

						'move': function(coords) {
							var diff = coords.x - startCoords.x;

							if (restrictLeft && diff < 0 || restrictRight && diff > 0) {
								return;
							}

							if (!isMax(diff)) {
								updateElementPosition(diff);
							}
						},

						'end': function(endCoords) {
							scope.$apply(function() {
								swiped = isSwiped(endCoords);
								scope.proceed = isCompleted(endCoords);
								updateElementPosition(0);
							});
						}
					});
				}
			}
		};
	}]);
