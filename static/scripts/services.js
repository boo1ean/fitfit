angular.module('fitApp.services', []).
	factory('storage', function () {
		'use strict';

		var STORAGE_PREFIX = 'fit + ';
		var ID_SUFFIX = ' + id';

		var k = function(key) {
			return STORAGE_PREFIX + key;
		};

		var i = function(key) {
			return k(key) + ID_SUFFIX;
		};

		var timestampify = function(object) {
			object.created_at = new Date().getTime();
			object.updated_at = new Date().getTime();
			object.accessed_at = new Date().getTime();

			return object
		};

		var removeItem = function(items, item) {
			for (var i in items) {
				if (items[i].id === item.id) {
					items.splice(i, 1);
					return items;
				}
			};
		};

		var findIndex = function(items, id) {
			for (var i in items) {
				if (items[i].id == id) {
					return i;
				}
			};

			return null;
		};

		var find = function(items, id) {
			return items[findIndex(items, id)];
		};

		var storage = {
			get: function (key) {
				return JSON.parse(localStorage.getItem(k(key)) || '[]');
			},

			set: function (key, value) {
				localStorage.setItem('updatedAt', new Date().getTime());
				localStorage.setItem(k(key), JSON.stringify(value));
			},

			getLastId: function(key) {
				return (localStorage.getItem(i(key)) - 0) || 0;
			},

			setLastId: function(key, value) {
				localStorage.setItem(i(key), value - 0);
			},

			nextId: function(key) {
				var id = storage.getLastId(key) + 1;
				storage.setLastId(key, id);
				return id;
			},
			
			push: function(key, value) {
				value.id = storage.nextId(key);

				var stored = storage.get(key);
				stored.unshift(value);
				storage.set(key, stored);

				return value;
			},

			find: function(key, id) {
				var stored = storage.get(key);
				return find(stored, id);
			},

			remove: function(key, item) {
				var stored = storage.get(key);
				stored = removeItem(stored, item);
				storage.set(key, stored);
				return stored;
			},

			update: function(key, id, attrs) {
				var stored = storage.get(key);
				var index = findIndex(stored, id);

				for (var i in attrs) {
					stored[index][i] = attrs[i];
				}

				storage.set(key, stored);
				return stored;
			},

			touch: function(key, id) {
				return storage.update(key, id, { accessed_at: new Date().getTime() });
			},

			exercises: function() {
				return storage.get('exercises');
			},

			addExercise: function(exercise) {
				exercise.weights = [10, 20, 30, 40];
				exercise.times = [6, 8, 10, 12];
				storage.push('exercises', timestampify(exercise));
			},

			removeExercise: function(exercise) {
				return storage.remove('exercises', exercise);
			},
			
			touchExercise: function(id) {
				return storage.touch('exercises', id);
			},

			updateExercise: function(id, attrs) {
				return storage.update('exercises', id, attrs);
			},

			findExercise: function(id) {
				return storage.find('exercises', id);
			},

			workouts: function() {
				return storage.get('workouts');
			},

			addWorkout: function(workout) {
				return storage.push('workouts', timestampify(workout));
			},

			removeWorkout: function(workout) {
				return storage.remove('workouts', workout);
			},

			updateWorkout: function(workout) {
				return storage.update('workouts', workout.id, workout);
			},

			findWorkout: function(id) {
				return storage.find('workouts', id);
			},

			serialize: function() {
				return localStorage;
			},

			syncedAt: function(val) {
				if (val) {
					return localStorage.setItem('syncedAt', val);
				}

				return localStorage.getItem('syncedAt');
			},

			syncNow: function() {
				storage.syncedAt(new Date().getTime());
			},

			sync: function(data) {
				if (data.updatedAt > storage.syncedAt()) {
					for (var i in data) {
						localStorage.setItem(i, data[i]);
					}
				}

				storage.syncNow();
			}
		};

		return storage;
	});
