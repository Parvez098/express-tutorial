const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let accessToken = new Schema({
	user_id:String,
	access_token:String,
	expiry:String,
});

module.exports = mongoose.model("AccessToken",accessToken);
