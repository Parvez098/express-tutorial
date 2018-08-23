const DBuser = require("../model/user");
const AddressCollection = require("../model/address");


async function dataProvider(id) {
    let result = {};
    let user_details;
    let address_details;
    try {
        user_details = await DBuser.User.findById(id);
        address_details = await AddressCollection.findOne({ user_id: id });
    } catch (err) {
        return err;
    }
    result.user_details = user_details;
    result.address_details = address_details;
    return result;
}


module.exports = {
    dataProvider: dataProvider
}