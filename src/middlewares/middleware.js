exports.middlewareGlobal = (request, response, next) => {
    response.locals.errors = request.flash("errors");
    response.locals.success = request.flash("success");
    response.locals.user = request.session.user;
    next();
};

exports.middlewareCheckCsrfError = (error, request, response, next) => {
    if (error) return response.render("404");
    next();
};

exports.middlewareCsrfToken = (request, response, next) => {
    response.locals.csrfToken = request.csrfToken();
    next();
};

exports.loginRequired = (request, response, next) => {
    if(!request.session.user) {
        request.flash("errors", "Você precisa estar logado para acessar essa aba.");
        request.session.save(() => response.redirect("/login/index"));
        return;
    }
    next();
}