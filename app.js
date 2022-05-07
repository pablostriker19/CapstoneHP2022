const express = require("express");
const app = express();
const hbs = require("hbs");
const router = express.Router();
const path = require("path");

//Sesiones: este es el codigo necesario para las sesiones
    const session = require("express-session");
    app.use(session({
        secret: "clavesecretajkdsfn904309gtfi",
        resave: false,
        saveUninitialized: false
    }));



const res = require("express/lib/response");
const req = require("express/lib/request");
const cookieParser = require("cookie-parser");


app.set("views", __dirname + "/src/views");
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "/src/public")));
hbs.registerPartials(__dirname + "/src/views/partials");
app.use("/", router);


//  -----------------------------------------------------------------------------------
//  RENDERIZACION DE PAGINAS

//  Pagina de login
    app.get("/", (req, res, next) => {
        res.render("index", {layout: false});
    });
//  Pagina de registro
    app.get("/registro", (request, response, next) => {
        response.render("registro", {layout: false});
    });
//  Pagina de inicio
    app.get("/inicio", (request, response, next) => {
    if(!request.session.username){
        response.redirect("/");
    } else {
        response.render("inicio");      
    }
    });
//  Pagina de mis pokemons
    app.get("/mispokemons", (request, response, next) => {  
        //POKEMONS DE PRUEBA
        const pokemons = [
            {
                name: "Charizard",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png",
                tipo: "Fuego"
            },
            {
                name: "Blastoise",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png",
                tipo: "Agua"
            },
            {
                name: "Pikachu",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
                tipo: "Electrico"
            },

        ];
    if(!request.session.username){
        response.redirect("/");
    } else {
        response.render("mispokemons", {pokemons});
    }
    });
//  Pagina añadir pokemons
    app.get("/maspokemons", (request, response, next) => {

        //POKEMONS DE PRUEBA
        const pokemons = [
            {
                name: "Bulbasaur",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
                tipo: "Planta"
            },
            {
                name: "Ivysaur",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/002.png",
                tipo: "Planta"
            },
            {
                name: "Venusaur",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/003.png",
                tipo: "Planta"
            },
            {
                name: "Charmander",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
                tipo: "Fuego"
            },
            {
                name: "Charmeleon",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/005.png",
                tipo: "Fuego"
            },
            {
                name: "Charizard",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png",
                tipo: "Fuego"
            },
            {
                name: "Squirtle",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
                tipo: "Agua"
            },
            {
                name: "Wartortle",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/008.png",
                tipo: "Agua"
            },
            {
                name: "Blastoise",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png",
                tipo: "Agua"
            },
            {
                name: "Pikachu",
                photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
                tipo: "Electrico"
            },

        ];
    if(!request.session.username){
        response.redirect("/");
    } else {
        response.render("maspokemons", {pokemons});
    }
    });
//  Ver pokemon
    app.get("/verpokemon", (request, response, next) => {
    if(!request.session.username){
        response.redirect("/");
    } else {
        response.render("verpokemon");
    }
    });
//  Pagina contacto
    app.get("/cuenta", (request, response, next) => {
    if(!request.session.username){
        response.redirect("/");
    } else {    
        response.render("cuenta");
    }
    });
//  Pagina contacto
    app.get("/contacto", (request, response, next) => {
    if(!request.session.username){
        response.redirect("/");
    } else {    
        response.render("contacto");
    }
    });
//  Not found get
    app.get("/*", (request, response, next) => {
        let dataNotFound = {
        notFoundImage:
            "https://ih1.redbubble.net/image.373649743.0630/flat,750x,075,f-pad,750x1000,f8f8f8.u6.jpg",
        };
        response.render("404", dataNotFound);
    });
//  -----------------------------------------------------------------------------------


//  Codigo para hacer login
    router.get("/login", (request, response, next) => {
        request.session.username = "usuariodeprueba";
        request.session.save(function(err) {
            response.redirect("/inicio"); 
        })      
    });
//  Codigo para cerrar sesion
    router.get("/logout", (request, response, next) => {
        request.session.destroy();
        response.redirect("/");      
    });

app.use(cookieParser());
app.listen(5000, () => console.log("App listening on port 5000!"));