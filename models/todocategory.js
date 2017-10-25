var mongoose = require("mongoose");

var toDoCategorySchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	todos: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "ToDoItem"
	}],
	complete: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model("ToDoCategory", toDoCategorySchema, "ToDoCategories");