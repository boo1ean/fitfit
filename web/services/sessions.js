var users = require('../../core/dal/users'),
    crypt = require('../../core/crypt');

var service = {
	login: function(data) {
		users.findByEmail(data.email).then(function(user) {
			if (crypt.comparePassword(data.password, user.password)) {
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
