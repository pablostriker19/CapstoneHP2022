const express = require("express");
const app = express();
const hbs = require("hbs");
const router = express.Router();
const path = require("path");
//Sesiones
const session = require("express-session");
const res = require("express/lib/response");


app.set("views", __dirname + "/src/views");
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "/src/public")));
hbs.registerPartials(__dirname + "/src/views/partials");
app.use("/", router);

//RENDERIZACION DE PAGINAS
//Pagina principal get
app.get("/", (req, res, next) => {
    res.render("registro");
});

//Pagina principal
app.get("/index", (request, response, next) => {
    response.render("index");
});

//Pagina de inicio
app.get("/inicio", (request, response, next) => {
    response.render("inicio");
});

//Pagina de mis pokemons
app.get("/mispokemons", (request, response, next) => {
    
    //POKEMONS DE PRUEBA
        const pokemons = [
            {
                name: "Ekans",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png",
                especie: "Serpiente",
                tipo: "Veneno",
                habilidades: "Intimidar, mudar"
            },
            {
                name: "Exeggutor",
                photo: "https://static.wikia.nocookie.net/espokemon/images/e/e0/Exeggutor.png/revision/latest?cb=20080908162819",
                especie: "Coco",
                tipo: "Planta, Psiquico",
                habilidades: "Clorofila"
            },

        ];
response.render("mispokemons", {pokemons});
});

//Pagina añadir pokemons
app.get("/maspokemons", (request, response, next) => {
    response.render("maspokemons");
});

//Pagina contacto
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