var mongoose = require("mongoose");

var toDoCategorySchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	complete: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model("ToDoCategory", toDoCategorySchema, "ToDoCategories");