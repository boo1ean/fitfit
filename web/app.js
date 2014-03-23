var express = require('express'),
    dot = require('express-dot'),
    resolve = require('path').resolve,
    sessions = require('./services/sessions'),
    users = require('../core/services/users'),
    config = require('../config'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session);

var sessionStorage = new RedisStore(config.sessions.redis.connection);

var port = 3042;
var app = express();

app.configure(function() {
	app.use(express.static(config.paths.staticContent));
	app.set('views', config.paths.views);
	app.engine('html', dot.__express);
	app.use(express.compress());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(session({ store: sessionStorage, secret: config.sessions.secret }));
});

app.post('/login', function(req, res) {
	if (req.session.user) {
		return res.redirect('/');
	}

	sessions.login(req.body).then(function(user) {
		req.session.user = user;
		res.redirect('/');
	}, function(errors) {
		res.send(errors);
	});
});

app.get('/data', function(req, res) {
	users.get(req.session.user).then(res.send.bind(res));
});

app.post('/data', function(req, res) {
	users.save(req.body, req.session.user).then(res.send.bind(res));
});

app.post('/register', function(req, res) {
	if (req.session.user) {
		return res.redirect('/');
	}

	users.create(req.body).then(function() {
		res.redirect('/login');
	});
});

app.get('/logout', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/');
	});
})

app.get('*', function(req, res) {
	res.render('index.html', {
		layout: false,
		user: req.session.user
	});
});

app.listen(port);
