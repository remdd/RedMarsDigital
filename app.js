var express 				= require('express'),
	logger					= require('morgan'),
	dotenv					= require('dotenv'),
	favicon					= require('serve-favicon'),
	mongoose				= require('mongoose'),
	mongoosePaginate 		= require('mongoose-paginate'),
	bodyParser 				= require('body-parser'),
	methodOverride			= require('method-override'),
	BlogPost				= require('./models/blogpost'),
	app 					= express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(favicon('public/img/favicon.png'));

dotenv.config({path: '.env'});				//	Loads environment variables file

//	Connects mongoose to db
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DBPATH, {useMongoClient: true});

//	Default use of body parser
app.use(bodyParser.urlencoded({extended: true}));

//	Use method-override to look for _method in URL to convert to specified request (PUT or DELETE)
app.use(methodOverride("_method"));




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
	BlogPost.paginate( {}, { 
		limit: 10, 
		sort: {datePosted: -1}, 
		page: req.query.page 
	}, function(err, blogPosts) {
		if(err) {
			console.log(err);
			res.redirect('/');
		} else {
			res.render("blog", {blogPosts: blogPosts});
		}
	});

});
//	NEW - show form to create new finding
app.get('/blog/new', function(req, res) {
	res.render('blog/new');
});
//	CREATE blog post
app.post('/blog', function(req, res) {
	console.log(req.body.blogPost);
	req = addDate(req);
	BlogPost.create(req.body.blogPost, function(err, blogPost) {
		if(err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.redirect('/blog');
		}
	});
});
//	SHOW blog post
app.get('/blog/:id', function(req, res) {
	BlogPost.findById(req.params.id)
	.exec(function(err, blogPost) {
		if(err) {
			console.log(err);
			res.redirect('/blog');
		} else if(!blogPost) {
			res.render('404');
		} else {
			res.render('blog/show', {blogPost: blogPost});
		};
	});
});
//	EDIT blog post
app.get('/blog/:id/edit', function(req, res) {
	BlogPost.findById(req.params.id)
	.exec(function(err, blogPost) {
		if(err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.render('blog/edit', {blogPost: blogPost});
		}
	});
});
//	UPDATE blog post
app.put('/blog/:id', function(req, res) {
	BlogPost.findByIdAndUpdate(req.params.id, req.body.blogPost, function(err, blogPost) {
		if(err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.redirect('/blog/' + req.params.id);
		}
	});
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




function addDate(req) {
	var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
	var d = new Date();
	console.log(d);
	req.body.blogPost.datePosted = d;
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();
	req.body.blogPost.dateDisplay = curr_date + " " + m_names[curr_month] + " " + curr_year;
	return req;
}

app.listen(process.env.PORT, process.env.IP, function() {
	console.log("Server started");
});
