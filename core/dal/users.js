var db = require('../db'),
    Q = require('q');

var dal = {
	findByEmail: function(email) {
		return Q({
			id: 'asfasdf',
			email: 'asasfds',
			password: 'qweqwe'
		});
	},

	create: function(row) {
		return db.insert('users', row);
	}
};

module.exports = dal;
