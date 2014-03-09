var express = require('express'),
    resolve = require('path').resolve;

var port = 3042;
var app = express();

app.use(express.static(__dirname + '/../static'));
app.get('*', function(req, res) {
	res.sendfile(resolve(__dirname + '/../static/index.html'));
});

app.listen(port);
