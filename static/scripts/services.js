angular.module('fitApp.services', []).
	factory('storage', function () {
		'use strict';

		var STORAGE_PREFIX = 'best fit storage ever + ';

		var k = function(key) {
			return STORAGE_PREFIX + key;
		};

		var timestampify = function(object) {
			object.created_at = new Date();
			object.updated_at = new Date();

			return object
		};

		var storage = {
			get: function (key) {
				return JSON.parse(localStorage.getItem(k(key)) || '[]');
			},

			set: function (key, value) {
				localStorage.setItem(k(key), JSON.stringify(value));
			},
			
			push: function(key, value) {
				var stored = storage.get(key);
				stored.push(value);
				storage.set(key, stored);
			},

			exercises: function() {
				return storage.get('exercises');
			},

			addExercise: function(exercise) {
				storage.push('exercises', timestampify(exercise));
			}
		};

		return storage;
	});
