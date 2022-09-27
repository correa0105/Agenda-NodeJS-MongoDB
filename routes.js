
const express = require("express");
const route = express.Router();

const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");
const contactController = require("./src/controllers/contactController");

const { loginRequired } = require("./src/middlewares/middleware");

/* ROTAS DA HOME */
route.get("/",loginRequired, homeController.index);

/* ROTAS DE LOGIN */
route.get("/login/index", loginController.index);
route.post("/login/register", loginController.register);
route.post("/login/login", loginController.login);
route.get("/login/logout", loginController.logout);

/* ROTAS DE CONTATO */
route.get("/contact/index", loginRequired, contactController.index);
route.post("/contact/register", loginRequired, contactController.register);
route.get("/contact/index/:id", loginRequired, contactController.editContact);
route.post("/contact/edit/:id", loginRequired, contactController.edit);
route.get("/contact/delete/:id", loginRequired, contactController.delete);

module.exports = route;
