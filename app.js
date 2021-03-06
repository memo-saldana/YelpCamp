var express = require("express"),
		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
    flash = require('connect-flash'),
		passport = require("passport"),
		LocalStrategy = require("passport-local"),
		methodOverride = require("method-override"),
		Campground = require("./models/campground"),
		Comment = require("./models/comment"),
		User = require("./models/user"),
		seedDB = require("./seeds");

var PORT = process.env.PORT || 3000

// requiring routes
var commentRoutes = require("./routes/comments"),
		campgroundRoutes = require("./routes/campgrounds"),
		indexRoutes = require("./routes/index");

mongoose.connect(process.env.YELPCAMPDB, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));	
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash())
// seedDB(); seed the database

// Passport Config

app.use(require("express-session")({
	secret: "This time Jaina will win because she is a very cute cat.",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next) {
	res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success")
	next();
})

// Campground.create(
// 	{
// 		name: "Mountain Goat's Rest", 
// 		image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Gypsy_camp%2C_Bekonscot.JPG",
// 		description:"This is a mountain for a goat to rest in."
	
// 	}, function(err,campground) {
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log("Created:");
// 			console.log(campground);
// 		}
// 	});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(PORT,function() {
	console.log(`YelpCamp started on port ${ PORT }`);
});