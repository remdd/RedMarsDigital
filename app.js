var express 				= require('express'),
	logger					= require('morgan'),
	dotenv					= require('dotenv'),
	favicon					= require('serve-favicon'),
	mongoose				= require('mongoose'),
	mongoosePaginate 		= require('mongoose-paginate'),
	BlogPost				= require('./models/blogpost'),
	app 					= express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(logger('dev'));
app.use(favicon('public/img/favicon.png'));

dotenv.config({path: '.env'});				//	Loads environment variables file

//	Connects mongoose to db
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DBPATH, {useMongoClient: true});




//	ROUTES	//
app.get('/', function(req, res) {
	res.render('index');
});
app.get('/about', function(req, res) {
	res.render('about');
});
app.get('/projects', function(req, res) {
	res.render('projects');
});
app.get('/blog', function(req, res) {
	res.render('blog');
});
app.get('/creative', function(req, res) {
	res.render('creative');
});
app.get('/mars', function(req, res) {
	res.render('mars');
});

app.get('*', function(req,res) {
	res.render('404')
});



app.listen(process.env.PORT, process.env.IP, function() {
	console.log("Server started");
});
