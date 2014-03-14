var db = require('../db'),
    Q = require('q');

var dal = {
	findByEmail: function(email) {
		return db.findOne('users', { email: email });
	},

	create: function(row) {
		return db.insert('users', row);
	}
};

module.exports = dal;
