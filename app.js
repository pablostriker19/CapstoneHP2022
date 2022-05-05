const express = require("express");
const app = express();
const hbs = require("hbs");
const router = express.Router();
const path = require("path");

//Sesiones
const session = require("express-session");


app.set("views", __dirname + "/src/views");
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "/src/public")));
hbs.registerPartials(__dirname + "/src/views/partials");
app.use("/", router);

//Pagina principal get
app.get("/", (req, res, next) => {
    res.render("registro");
});


//Pagina contacto get
app.get("/inicio", (request, response, next) => {
    response.render("inicio");
});

//Pagina contacto get
app.get("/index", (request, response, next) => {
    response.render("index");
});

//Pagina contacto get
app.get("/contacto", (request, response, next) => {
    response.render("contacto");
});


//Pagina contacto get
app.get("/contacto", (request, response, next) => {
    response.render("contacto");
});


//Not found get
app.get("/*", (request, response, next) => {
    let dataNotFound = {
      notFoundImage:
        "https://ih1.redbubble.net/image.373649743.0630/flat,750x,075,f-pad,750x1000,f8f8f8.u6.jpg",
    };
    response.render("404", dataNotFound);
});


app.listen(5000, () => console.log("App listening on port 5000!"));