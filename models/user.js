var mongoose = require("mongoose");
var passportLocalMongooseEmail = require("passport-local-mongoose-email");
var bcrypt = require("bcrypt-nodejs");

var UserSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String },
	email: { type: String, required: true, unique: true },
});

//	Adds local passport methods to mongoose schema
UserSchema.plugin(passportLocalMongooseEmail, {
	usernameField: 'email'
});

module.exports = mongoose.model("User", UserSchema);
