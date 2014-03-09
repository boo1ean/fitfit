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

		var removeItem = function(items, item) {
			for (var i in items) {
				if (items[i].name === item.name) {
					items.splice(i, 1);
					return items;
				}
			};
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
				stored.unshift(value);
				storage.set(key, stored);
			},

			removeItem: function(key, item) {
				var stored = storage.get(key);
				stored = removeItem(stored, item);
				storage.set(key, stored);
				return stored;
			},

			exercises: function() {
				return storage.get('exercises');
			},

			addExercise: function(exercise) {
				storage.push('exercises', timestampify(exercise));
			},

			removeExercise: function(exercise) {
				return storage.removeItem('exercises', exercise);
			},

			workouts: function() {
				return storage.get('workouts');
			},

			addWorkout: function(workout) {
				storage.push('workouts', timestampify(workout));
			}
		};

		return storage;
	});
