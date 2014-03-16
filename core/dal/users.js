var db = require('../db'),
    Q = require('q');

var dal = {
	findByEmail: function(email) {
		return db.findOne('users', { email: email });
	},

	create: function(row) {
		return db.insert('users', row);
	},

	updateByEmail: function(email, data) {
		var criteria = { email: email };
		return db.update('users', criteria, data);
	}
};

module.exports = dal;
