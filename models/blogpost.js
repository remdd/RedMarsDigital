var mongoose = require("mongoose");

var BlogPostSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true },
	content: String,
	datePosted: Date
});

module.exports = mongoose.model("BlogPost", BlogPostSchema, "blogposts");