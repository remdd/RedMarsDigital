var mongoose = require("mongoose");
var	mongoosePaginate = require('mongoose-paginate');

var hiScoreSchema = new mongoose.Schema({
	name: { type: String, required: true },
	score: { type: Number, required: true },
	seed: Number,
	date: Date,
	defeatedBaron: Boolean,
	level: Number,
	source: String
});

hiScoreSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("HiScore", hiScoreSchema, "hiscores");
