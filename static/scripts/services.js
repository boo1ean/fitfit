angular.module('fitApp.services', []).
	factory('storage', function () {
		'use strict';

		var STORAGE_ID = 'best fit storage ever';

		return {
			get: function () {
				return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
			},

			put: function (todos) {
				localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
			}
		};
	});
