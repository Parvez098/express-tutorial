const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/express");


let userSchema = new Schema({

	  username:String,
	  password:String,
	  email:String,
	  firstName:String,
	  lastName:String
});




module.exports.User = mongoose.model("User",userSchema);