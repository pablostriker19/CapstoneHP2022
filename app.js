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
app.get("/registro", (req, res, next) => {
    res.render("registro", {layout: false});
});

//  Pagina de inicio
app.get("/inicio", (req, res, next) => {
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
    if(!req.session.username){
        res.redirect("/");
    } else {
        let data = {
            username: req.session.username,
            pokemons
        }
        res.render("inicio", data);      
    }
});

//  Pagina de mis pokemons
app.get("/mispokemons", (req, res, next) => {  
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
    if(!req.session.username){
        res.redirect("/");
    } else {
        res.render("mispokemons", {pokemons});
    }
});
//  Pagina añadir pokemons
app.get("/maspokemons", (req, res, next) => {

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
    if(!req.session.username){
        res.redirect("/");
    } else {
        res.render("maspokemons", {pokemons});
    }
});

//  Ver pokemon
app.get("/verpokemon", (req, res, next) => {
    if(!req.session.username){
        res.redirect("/");
    } else {
        res.render("verpokemon");
    }
});

//  Pagina cuenta
app.get("/cuenta", (req, res, next) => {
    if(!req.session.username){
        res.redirect("/");
    } else {    
        res.render("cuenta", req.session);
    }
});

//  Pagina contacto
app.get("/contacto", (req, res, next) => {
    if(!req.session.username){
        res.redirect("/");
    } else {    
        res.render("contacto");
    }
});

//  Not found get
app.get("/*", (req, res, next) => {
    if(!req.session.username){
        res.redirect("/");
    } else {    
        let dataNotFound = {
            notFoundImage:
            "https://images6.alphacoders.com/109/1094097.png",
        };
    res.render("404", dataNotFound);
    }
});
//  -----------------------------------------------------------------------------------


//  Codigo para hacer login
router.get("/login", (req, res, next) => {
    req.session.username = "usuariodeprueba";
    req.session.save(function(err) {
        res.redirect("/inicio"); 
    })      
});
//  Codigo para cerrar sesion
router.get("/logout", (req, res, next) => {
    req.session.destroy();
    res.redirect("/");      
});

app.use(cookieParser());
app.listen(5000, () => console.log("App listening on port 5000!"));