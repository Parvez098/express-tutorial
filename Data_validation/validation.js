async function dataValidation(checkBody, validationErrors, body) {
    checkBody('city').notEmpty().withMessage("required city").len(2, 10).withMessage("city length must be in 2 to 10 character");
    checkBody('state').notEmpty().withMessage("required state").len(2, 10);
    checkBody("phone_no").notEmpty().withMessage("phone number can't be empty").len(10).withMessage("");
    checkBody('pin_code').notEmpty().withMessage("please type your pin code");
    checkBody("address").notEmpty().withMessage("please type your address");
    let errors = validationErrors();
    if (errors) {
        return new Error(JSON.stringify(errors[0]));
    } else {
        return body
    }
}


module.exports = {

    dataValidation: dataValidation

}