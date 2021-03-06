var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")
var middleware = require("../middleware");
//INDEX
router.get("/",function(req,res) {

	Campground.find({},function(err,campgrounds) {
		if(err){
			console.log(err);
		} else {
			
			res.render("campgrounds/index",{campgrounds:campgrounds});
		}
	})
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req,res) {
	var name = req.body.name;
  var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}

	var newCamp = {name: name, price: price, image: image, description: desc, author: author};
	
	Campground.create(newCamp,function(err,newlyCreated) {
		if(err){
			console.log(err);
		} else {
			console.log(newlyCreated);
			res.redirect("/");
		}
	})
});

//NEW
router.get("/new", middleware.isLoggedIn, function(req,res) {
	res.render("campgrounds/new");
});

//SHOW
router.get("/:id",function(req,res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
		if(err){
			console.log(err);
		} else {
      if(!foundCamp){
        req.flash("error","Campground not found")
        return res.redirect("back")
      }
			console.log(foundCamp);
			res.render("campgrounds/show", {campground: foundCamp});
		}
	});
});	

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res) {
	Campground.findById(req.params.id, function(err,foundCampground) {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
      if(!foundCampground){
        req.flash("error","Campground not found")
        return res.redirect("back")
      }
			res.render("campgrounds/edit",{campground: foundCampground});
		}
	});
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground) {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	} )
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res) {

	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	})
});

module.exports = router;