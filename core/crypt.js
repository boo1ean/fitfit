var bcrypt = require('bcrypt');

exports.cryptPassword = function(password) {
	return bcrypt.hashSync(password, 10);
};

exports.comparePassword = function(password, hash) {
	return bcrypt.compareSync(password, hash);
};
