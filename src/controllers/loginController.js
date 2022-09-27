const Login = require("../models/LoginModel")

exports.index = (request, response) => {
    if (request.session.user) return response.render("loged");
    return response.render("login");
};

exports.register = async (request, response) => {
    try {

        const login = new Login(request.body);
        await login.register();

        if (login.errors.length > 0) {
            request.flash("errors", login.errors);
            request.session.save(() => { return response.redirect("index"); });
            return;
        }

        request.flash("success", "Seu usuário foi criado com sucesso.");
        request.session.save(() => { return response.redirect("index"); });
        return;

    } catch (error) {

        console.log(error);
        return response.render("404");

    }
};

exports.login = async (request, response) => {
    try {

        const login = new Login(request.body);
        await login.login();

        if (login.errors.length > 0) {
            request.flash("errors", login.errors);
            request.session.save(() => { return response.redirect("index"); });
            return;
        }

        request.flash("success", "Usuário logado com sucesso!");
        request.session.user = login.user;
        request.session.save(() => { return response.redirect("index"); });
        return;

    } catch (error) {

        console.log(error);
        return response.render("404");

    }
};

exports.logout = (request, response) => {
    request.session.destroy();
    return response.redirect("/");
}