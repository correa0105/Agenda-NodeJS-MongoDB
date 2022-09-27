require("dotenv").config();    

const express = require ("express");
const app = express();

const mongoose = require("mongoose");
mongoose.connect(process.env.CONNECTIONSTRING).then(() => {
    console.log("Conectado a Base de Dados!")
    app.emit("Pronto");
}).catch(e => {
    console.log(e);
});

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const routes = require("./routes");
const path = require("path");
const helmet = require("helmet");
const csrf = require("csurf");
const { middlewareGlobal, middlewareCheckCsrfError, middlewareCsrfToken} = require("./src/middlewares/middleware");

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));

const sessionOptions = session({
    secret: "qwert123",
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
})

app.use(sessionOptions);
app.use(flash());

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(csrf());

/* SÃO NOSSOS PROPRIOS MIDDLEWARES */
app.use(middlewareGlobal);
app.use(middlewareCsrfToken);
app.use(middlewareCheckCsrfError);

app.use(routes);

app.on("Pronto", () => {
    app.listen(3000, () => {
        console.log("Acessar http://localhost:3000/login/index")
        console.log("Servidor sendo executado na porta 3000")
    })
})
