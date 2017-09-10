var express 				= require('express'),
	logger					= require('morgan'),
	dotenv					= require('dotenv'),
	favicon					= require('serve-favicon'),
	app 					= express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(logger('dev'));
app.use(favicon('public/img/favicon.png'));

dotenv.config({path: '.env'});				//	Loads environment variables file

//	ROUTES	//
app.get('/', function(req, res) {
	res.render('index');
});

app.listen(process.env.PORT, process.env.IP, function() {
	console.log("Server started");
});
