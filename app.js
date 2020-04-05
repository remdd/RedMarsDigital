var express 				= require('express'),
	logger						= require('morgan'),									//	Logger
	dotenv						= require('dotenv'),
	favicon						= require('serve-favicon'),
	mongoose					= require('mongoose'),
	mongoosePaginate 	= require('mongoose-paginate'),				//	Paginate blogposts
	bodyParser 				= require('body-parser'),
	methodOverride		= require('method-override'),
	User							= require('./models/user'),						//	Site user schema for authentication
	BlogPost					= require('./models/blogpost'),
	ToDoItem					= require('./models/todoitem'),				
	ToDoCategory			= require('./models/todocategory'),
	HiScore						= require('./models/hiscore'),				//	Baron Backslash player high score schema
	passport					= require('passport'),								//	User auth
	LocalStrategy			= require('passport-local'),
	expressSession		= require('express-session'),
	mongoDBStore			= require('connect-mongodb-session')(expressSession),
	flash							= require('connect-flash'),
	cors 							=	require('cors'),
	app 							= express();

//	Catchall container for config settings
var config = {
	mongo: {}
};

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(favicon('public/img/favicon20.png'));

//	Allow cross-origin requests (for gathering baron backslash hiscores)
// app.use(cors());

//	Load environment variables from file
dotenv.config({path: '.env'});

//	Connects mongoose to db
mongoose.Promise = global.Promise;
if(process.env.DBPATH) {
	config.mongo.connected = true;
	mongoose.connect(process.env.DBPATH, {useMongoClient: true});
} else {
	config.mongo.connected = false;
}

//	Default use of body parser
app.use(bodyParser.urlencoded({extended: true}));

//	Use method-override to look for _method in URL to convert to specified request (PUT or DELETE)
app.use(methodOverride("_method"));

//	MongoDBStore config
if(config.mongo.connected) {
	var store = new mongoDBStore(
		{
			uri: process.env.DBPATH,
			collection: 'sessions'
		}, err => {
			if(err) {
				config.mongo.connected = false;
				console.log(err);
			} else {
				config.mongo.connected = true;
			}
		}
	);

	//	Catch MongoDBStore errors
	store.on('error', err => {
		if(err) {
			config.mongo.connected = false;
			console.log(err);
		}
	});

	//	Express-session and Passport config
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

	//	Flash messages
	app.use(flash());

	//	Middleware to make req.user etc available to all routes
	app.use((req, res, next) => {
		res.locals.currentUser = req.user;
		res.locals.error = req.flash("error");
		res.locals.success = req.flash("success");
		next();
	});
}


//	Array of images to enable display of random graphic in footer of blogPosts
var icons = ['Mariner4.png', 'Mars3.png', 'MRO.png', 'Phobos.png', 'Rover.png', 'Deimos.png', 'Sojourner.png'];


//	ROUTES	//
app.get('/', (req, res) => {
	res.render('index');
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.get('/projects', (req, res) => {
	res.render('projects');
});

app.get('/projects/:name', (req, res) => {
	var randomIcon = Math.floor(Math.random() * icons.length);
	var footerIcon = icons[randomIcon];
	res.render('projects/' + req.params.name, { footerIcon: footerIcon });
});

app.get('/blog', (req, res) => {
	if(config.mongo.connected) {
		if(!(req.query.page)) {
			req.query.page = 1;
		}
		BlogPost.paginate( {}, { 
			limit: 10, 
			sort: {datePosted: -1}, 
			page: req.query.page 
		}, (err, blogPosts) => {
			if(err) {
				console.log(err);
				res.redirect('/');
			} else {
				res.render("blog", {blogPosts: blogPosts});
			}
		});
	} else {
		res.render('404');
	}
});

//	NEW blog post form
app.get('/blog/new', isLoggedIn, (req, res) => {
	res.render('blog/new');
});

//	CREATE blog post
app.post('/blog', isLoggedIn, (req, res) => {
	req = addDate(req);
	req.body.blogPost.textContent = striptags(req.body.blogPost.content);
	BlogPost.create(req.body.blogPost, (err, blogPost) => {
		if(err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.redirect('/blog');
		}
	});
});

//	SHOW blog post
app.get('/blog/:id', (req, res) => {
	BlogPost.findById(req.params.id)
	.exec((err, blogPost) => {
		if(err) {
			console.log(err);
			res.redirect('/blog');
		} else if(!blogPost) {
			res.render('404');
		} else {
			BlogPost.find({"datePosted": {"$gt": blogPost.datePosted}}).sort({"datePosted": 1}).limit(1)
			.exec((err, nextPost) => {
				if(err) {
					console.log(err);
					res.redirect('/blog');
				} else {
					BlogPost.find({"datePosted": {"$lt": blogPost.datePosted}}).sort({"datePosted": -1}).limit(1)
					.exec((err, prevPost) => {
						if(err) {
							console.log(err);
							res.redirect('/blog');
						} else {
							var randomIcon = Math.floor(Math.random() * icons.length);
							var footerIcon = icons[randomIcon];
							res.render('blog/show', {blogPost: blogPost, nextPost: nextPost[0], prevPost: prevPost[0], footerIcon: footerIcon});
						}
					});
				}
			});
		};
	});
});

//	EDIT blog post form
app.get('/blog/:id/edit', isLoggedIn, (req, res) => {
	BlogPost.findById(req.params.id)
	.exec((err, blogPost) => {
		if(err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.render('blog/edit', {blogPost: blogPost});
		}
	});
});

//	UPDATE blog post
app.put('/blog/:id', isLoggedIn, (req, res) => {
	req.body.blogPost.textContent = striptags(req.body.blogPost.content);
	BlogPost.findByIdAndUpdate(req.params.id, req.body.blogPost, (err, blogPost) => {
		if(err) {
			console.log(err);
			res.redirect('back');
		} else {
			res.redirect('/blog/' + req.params.id);
		}
	});
});

app.get('/creative', (req, res) => {
	res.render('creative');
});

app.get('/creative/:name', (req, res) => {
	var randomIcon = Math.floor(Math.random() * icons.length);
	var footerIcon = icons[randomIcon];
	res.render('creative/' + req.params.name, { footerIcon: footerIcon });
});

app.get('/mars', (req, res) => {
	res.render('mars');
});

//	Baron Backslash game
function addDummyScores(hiScores) {
	if(hiScores.length >= 10) {
		return hiScores;
	} else {
		console.log("Adding dummy scores...");
		var add = 10 - hiScores.length;
		for(var i = 0; i < add; i++) {
			var name = dummyNames[Math.floor(Math.random() * dummyNames.length)];
			var score;
			score = dummyScores[Math.floor(Math.random() * dummyScores.length)];
			var dummyScore = {
				name: name,
				score: score,
				level: 1,
				defeatedBaron: false,
				seed: 0,
				date: Date.now()
			}
			hiScores.push(dummyScore);
		}
		hiScores = sort_by_key_value(hiScores, 'score');
		return hiScores;
	}
}

var dummyNames = [
	'Sneaky Skelton',
	'Blue Squark',
	'Camp Vamp',
	'Green Goblin',
	'Black Wiz',
	'Red Wiz',
	'Ogr',
	'Urk Shaman',
	'Black Knight',
	'Green Sludgie',
	'Badbug',
	'Zombi Master',
	'Mini Kob',
	'Rocko',
	'Pebbl',
	'Mumi',
	'Grimlin'
];

var dummyScores = [
	10,
	20,
	30,
	40,
	50
];
	
console.log("Baron Backslash configured...");

app.get('/baronbackslash', cors(), (req, res) => {
	res.render('baronbackslash');	//	Preloader instance
});

//	All time scores
app.get('/baronbackslash/alltimescores', cors(), (req, res) => {
	HiScore.find({})
	.sort({'score': -1})
	.limit(10)
	.exec((err, hiScores) => {
		if(err) {
			console.log(err);
			res.json({});
		} else {
			hiScores = addDummyScores(hiScores);
			res.json(hiScores);
		}
	});
});

//	Today's scores
app.get('/baronbackslash/todayscores', cors(), (req, res) => {
	//	Calculate 24 hrs ago
	var period = Date.now() - (1000 * 60 * 60 * 24);
	HiScore.find({ "date": { "$gte": period }})
	.sort({'score': -1})
	.limit(10)
	.exec((err, hiScores) => {
		if(err) {
			console.log(err);
			res.json({});
		} else {
			hiScores = addDummyScores(hiScores);
			res.json(hiScores);
		}
	});
});

//	Post new score
app.post('/baronbackslash/score', cors(), (req, res) => {
	console.log(req.body);
	HiScore.create(req.body, (err, hiScore) => {
		if(err) {
			console.log(err);
			res.json({});
		} else {
			res.json({});
		}
	});
});

function sort_by_key_value(arr, key) {
  var to_s = Object.prototype.toString;
  var valid_arr = to_s.call(arr) === '[object Array]';
  var valid_key = typeof key === 'string';

  if (!valid_arr || !valid_key) {
    return;
  }

  arr = arr.slice();

  return arr.sort((a, b) => {
    var a_key = String(a[key]);
    var b_key = String(b[key]);
    var n = b_key - a_key;
    return !isNaN(n) ? n : a_key.localeCompare(b_key);
  });
}


//	ToDo list page - visible to registered users only
app.get('/todo', isLoggedIn, (req, res) => {
	ToDoCategory.find({})
	.populate( { path: "todos", options: { sort: {'complete': 1, 'name': 1}} } )
	.sort( {'complete': 1, 'name': 1} )
	.exec((err, categories) => {
		if(err) {
			console.log(err);
			req.flash('error', 'Something went wrong...');
			res.redirect('back');
		} else {
			res.render('todo', { categories: categories });
		}
	});
});

app.post('/todo/cat', isLoggedIn, (req, res) => {
	ToDoCategory.create(req.body, (err, category) => {
		if(err) {
			console.log(err);
			req.flash("error", "Something went wrong...");
		} else {
			req.flash('success', 'Successfully added Category.');
		}
	});
});

app.put('/todo/:id', isLoggedIn, (req, res) => {
	ToDoItem.findOne( { 'name': req.params.id } , (err, todo) => {
		if(err) {
			console.log(err);
			req.flash('error', 'Something went wrong...');
		} else {
			var complete = true;
			if(todo.complete) {
				complete = false;
			}
			ToDoItem.findByIdAndUpdate(todo._id, { 'complete': complete }, (err, todo) => {
				if(err) {
					console.log(err);
					req.flash('error', 'Something went wrong...');
				} else {
					res.json(todo);
				}
			});
		}
	});
});

app.post('/todo/newToDo', isLoggedIn, (req, res) => {
	ToDoItem.create(req.body, (err, todo) => {
		if(err) {
			console.log(err);
			req.flash("error", "Something went wrong...");
		} else {
			ToDoCategory.findOneAndUpdate( { 'name': req.body.cat }, { $push: { todos: todo._id } }, (err, cat) => {
				if(err) {
					console.log(err);
					req.flash("error", "Something went wrong...");
				} else {
					console.log('success - added todo');
					req.flash('success', 'Successfully added ToDo item.');
					res.json(todo);
				}
			});
		}
	});
});

app.delete('/todo/:id', isLoggedIn, (req, res) => {
	ToDoItem.findOne( { name: req.params.id }, (err, todo) => {
		if(err) {
			console.log(err);
			req.flash("error", "Something went wrong...");
			res.redirect('back');
		} else {
			ToDoItem.findByIdAndRemove(todo._id, (err) => {
				if(err) {
					console.log(err);
					req.flash("error", "Something went wrong...");
				} else {
					req.flash('success', 'Successfully deleted ToDo item.');
					res.json({});
				}
			});
		}
	})
});

app.delete('/todo/cat/:id', isLoggedIn, (req, res) => {
	ToDoCategory.findOne( { name: req.params.id }, (err, cat) => {
		if(err) {
			console.log(err);
			req.flash("error", "Something went wrong...");
			res.redirect('back');
		} else {
		console.log('deleting cat...');
			ToDoCategory.findByIdAndRemove(cat._id, (err) => {
				if(err) {
					console.log(err);
					req.flash("error", "Something went wrong...");
				} else {
					req.flash('success', 'Category deleted successfully.');
					res.json({});
				}
			});
		}
	});
});

//	Render login form
app.get('/login', (req, res) => {
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
app.get('/logout', (req, res) => {
	req.logout();			// all that passport requires to end session
	req.flash("success", "You have successfully logged out.");
	res.redirect('/');
});

//	Catch-all
app.get('*', (req,res) => {
	res.render('404')
});

//	User auth middleware for hidden routes
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You must be logged in to do that!");
	res.redirect('/login');
}

//	Convert date to dd-MMM-yyyy format
function addDate(req) {
	var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
	var d = new Date();
	req.body.blogPost.datePosted = d;
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();
	req.body.blogPost.dateDisplay = curr_date + " " + m_names[curr_month] + " " + curr_year;
	return req;
}

// //	Render new user form
// app.get('/register', (req, res) => {
// 	res.render('users/register');
// });

// //	Register new user route
// app.post('/register', (req, res) => {
// 	var newUser = new User(req.body.user);
// 	User.register(newUser, req.body.password, (err, user) => {
// 		if(err) {
// 			req.flash('error', err);
// 			res.redirect('/register');
// 		} else {
// 			req.flash('success', 'Success!');
// 			res.redirect('/index');
// 		}
// 	});
// });

app.listen(process.env.PORT || '3003', process.env.IP, () => {
	console.log(`Server started on port ${ process.env.PORT || '3003' }`);
});
