var express = require('express'),
    resolve = require('path').resolve,
    sessions = require('./services/sessions'),
    config = require('../config'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session);

var sessionStorage = new RedisStore(config.sessions.redis.connection);

var port = 3042;
var app = express();

app.configure(function() {
	app.use(express.compress());
	app.use(express.static(config.paths.staticContent));
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(session({ store: sessionStorage, secret: config.sessions.secret }));
});

app.post('/login', function(req, res) {
	sessions.login(req.body).then(function(user) {
		req.req.session.user = user;
		res.redirect('/');
	}, function(errors) {
		res.send(errors);
	});
});

app.get('/logout', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/');
	});
})

app.get('*', function(req, res) {
	res.sendfile(resolve(__dirname + '/../static/index.html'));
});

app.listen(port);
