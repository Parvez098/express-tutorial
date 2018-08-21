const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let address_schema = new Schema({
	user_id:String,
	address:[{type:String}],
	city:String,
	state:String,
	pin_code:Number,
	phone_no:Number
});


module.exports = mongoose.model("AddressCollection",address_schema);