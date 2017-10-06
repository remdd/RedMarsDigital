var mongoose = require("mongoose");
var	mongoosePaginate = require('mongoose-paginate');

var blogPostSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true },
	content: { type: String, required: true },
	textContent: { type: String },
	datePosted: Date,
	dateDisplay: String
});

blogPostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("BlogPost", blogPostSchema, "blogposts");