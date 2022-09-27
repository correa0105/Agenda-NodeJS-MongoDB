const mongoose = require("mongoose");
const validator = require("validator")

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: false, default: "" },
    tel: { type: String, required: true },
    email: { type: String, required: false, default: "" },
    createdIn: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model("Contact", ContactSchema);

function Contact(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;
}

Contact.prototype.register = async function () {
    this.validationContact();
    if (this.errors.length > 0) return;
    this.contact = await ContactModel.create(this.body);
}

Contact.prototype.validationContact = async function () {
    this.cleanUp();
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push("Email inválido!");
    if (!this.body.name) this.errors.push("Nome é um campo obrigatório.");
    if (!this.body.email && !this.body.tel) this.errors.push("Pelomenos um contato precisa ser enviado: Email ou Telefone.");
}

Contact.prototype.cleanUp = async function() {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = "";
        }
    }
    this.body = {
        name: this.body.name,
        lastname: this.body.lastname,
        tel: this.body.tel,
        email: this.body.email,
    }
}

Contact.prototype.edit = async function (id){
    if (typeof id !== 'string') return;
    this.validationContact();
    if (this.errors.length > 0) return;
    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true })
}

//MÉTODO ESTÁTICOS

Contact.searchId = async function (id) {
    if (typeof id !== 'string') return;
    const contact = await ContactModel.findById(id);
    return contact;
}

Contact.searchContacts = async function () {
    const contacts = await ContactModel.find().sort({ createdIn: -1 });
    return contacts;
}

Contact.delete = async function (id) {
    if (typeof id !== 'string') return;
    const contact = await ContactModel.findOneAndDelete({ _id: id });
    return contact;
}

module.exports = Contact;