const Contact = require("../models/ContactModel");

exports.index = async (request, response) => {
    const contacts = await Contact.searchContacts();
    response.render("index", { contacts });
};