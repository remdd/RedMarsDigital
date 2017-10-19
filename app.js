var express 				= require('express'),
	logger					= require('morgan'),
	dotenv					= require('dotenv'),
	favicon					= require('serve-favicon'),
	mongoose				= require('mongoose'),
	mongoosePaginate 		= require('mongoose-paginate'),
	bodyParser 				= require('body-parser'),
	methodOverride			= require('method-override'),
	User					= require('./models/user'),
	BlogPost				= require('./models/blogpost'),
	passport				= require('passport'),
	LocalStrategy			= require('passport-local'),
	expressSession			= require('express-session'),
	mongoDBStore			= require('connect-mongodb-session')(expressSession),
	flash					= require('connect-flash'),
	striptags				= require('striptags');
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

//	MongoDBStore config
var store = new mongoDBStore(
	{
		uri: process.env.DBPATH,
		collection: 'sessions'
	}, function(err) {
		if(err) {
			console.log(err);
		}
	}
);
//	MongoDBStore start error catching
store.on('error', function(err) {
	if(err) {
		console.log(err);
	}
});

//	Express-session and Passport usage
app.use(expressSession({
	secret: process.env.EXP_KEY,
	store: store,									//	Connects to MongoDBStore
	resave: true,									//	Was false - need to read into, is 'true' a risk?
	saveUninitialized: true,						//	Was false - need to read into, is 'true' a risk?
	httpOnly: true,									//	Don't let browser javascript access cookies
	secure: false									//	Set to true to limit cookies to https only (SET FOR PRODUCTION)
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//	Flash message use

app.use(flash());
//	Middleware to make req.user etc available to all routes
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//	Icon array for random display in footer of blogPosts
var icons = ['Mariner4.png', 'Mars3.png', 'MRO.png', 'Phobos.png', 'Rover.png', 'Deimos.png', 'Sojourner.png'];


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
app.get('/projects/:name', function(req, res) {
	console.log(req.params.name);
	res.render('projects/' + req.params.name);
});

app.get('/blog', function(req, res) {
	if(!(req.query.page)) {
		req.query.page = 1;
	}
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
app.get('/blog/new', isLoggedIn, function(req, res) {
	res.render('blog/new');
});
//	CREATE blog post
app.post('/blog', isLoggedIn, function(req, res) {
	console.log(req.body.blogPost);
	req = addDate(req);
	req.body.blogPost.textContent = striptags(req.body.blogPost.content);
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
			BlogPost.find({"datePosted": {"$gt": blogPost.datePosted}}).sort({"datePosted": 1}).limit(1)
			.exec(function(err, nextPost) {
				if(err) {
					console.log(err);
					res.redirect('/blog');
				} else {
					BlogPost.find({"datePosted": {"$lt": blogPost.datePosted}}).sort({"datePosted": -1}).limit(1)
					.exec(function(err, prevPost) {
						if(err) {
							console.log(err);
							res.redirect('/blog');
						} else {
							var randomIcon = Math.floor(Math.random() * icons.length);
							var footerIcon = icons[randomIcon];
							console.log(footerIcon);
							res.render('blog/show', {blogPost: blogPost, nextPost: nextPost[0], prevPost: prevPost[0], footerIcon: footerIcon});
						}
					});
				}
			});
		};
	});
});
//	EDIT blog post
app.get('/blog/:id/edit', isLoggedIn, function(req, res) {
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
app.put('/blog/:id', isLoggedIn, function(req, res) {
	req.body.blogPost.textContent = striptags(req.body.blogPost.content);
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
app.get('/creative/:name', function(req, res) {
	console.log(req.params.name);
	res.render('creative/' + req.params.name);
});
app.get('/mars', function(req, res) {
	res.render('mars');
});
app.get('/todo', isLoggedIn, function(req, res) {
	res.render('todo');
});

//	Render login form
app.get('/login', function(req, res) {
	res.render('users/login');
});

//	Login route
app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/',
	failureFlash: true,
	successFlash: 'Welcome!'
}));

//	Logout route
app.get('/logout', function(req, res) {
	req.logout();			// all that passport requires to end session
	req.flash("success", "You have successfully logged out.");
	res.redirect('/');
});

// //	Render new user form
// app.get('/register', function(req, res) {
// 	res.render('users/register');
// });

// //	Register new user route
// app.post('/register', function(req, res) {
// 	var newUser = new User(req.body.user);
// 	User.register(newUser, req.body.password, function(err, user) {
// 		if(err) {
// 			req.flash('error', err);
// 			res.redirect('/register');
// 		} else {
// 			req.flash('success', 'Success!');
// 			res.redirect('/index');
// 		}
// 	});
// });

app.get('*', function(req,res) {
	res.render('404')
});

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You must be logged in to do that!");
	res.redirect('/login');
}

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

// function stripHtml(html) {
// 	var temporaryElement = document.createElement('div');
// 	temporaryElement.innerHTML = html;
// 	return temporaryElement.textContent || temporaryElement.innerText || "";
// }

app.listen(process.env.PORT, process.env.IP, function() {
	console.log("Server started");
});
