var mongoose = require("mongoose");

var toDoItemSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	complete: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model("ToDoItem", toDoItemSchema, "ToDoItems");