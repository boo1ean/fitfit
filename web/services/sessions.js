var users = require('../../core/dal/users'),
    crypt = require('../../core/crypt');

var service = {
	login: function(data) {
		return users.findByEmail(data.email).then(function(user) {
			if (user && crypt.comparePassword(data.password, user.password)) {
				return user;
			}

			throw {
				errors: {
					email: 'Неверный логин или пароль'
				}
			}
		});
	}
};

module.exports = service;
