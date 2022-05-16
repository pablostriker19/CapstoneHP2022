import express from "express";
import hbs from "hbs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import crypto from "crypto";
import cookieParser from "cookie-parser";

const app = express();
const router = express.Router();
const randomBytes = crypto.randomBytes;

import Pokedex from "pokedex-promise-v2";
const P = new Pokedex();

const interval = {
  limit: 11,
  offset: 0,
};
var i;
P.getPokemonsList(interval).then((response) => {
  console.log(response.results);
});

var inicioSesionIncorrecto = false;
var sessionGuardada;

//Sesiones: este es el codigo necesario para las sesiones
//const session = require("express-session");
import session from "express-session";

app.use(
  session({
    secret: "clavesecretajkdsfn904309gtfi",
    resave: false,
    saveUninitialized: false,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", __dirname + "/src/views");
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "/src/public")));
hbs.registerPartials(__dirname + "/src/views/partials");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);

//  CONEXION CON MONGO

const url = "mongodb://localhost/users";
MongoClient.connect(url, function (err, client) {
  console.log("Conectado a MongoDB");
  // Client returned
  var db = client.db("test");

  db.collection("pokemon").findOne({}, function (findErr, result) {
    if (findErr) throw findErr;
    //console.log(result.name);
    client.close();
  });
});

//  -----------------------------------------------------------------------------------
//  RENDERIZACION DE PAGINAS

//  Pagina de login
app.get("/", (req, res, next) => {
  res.render("index", { layout: false });
});

//  Pagina de registro
app.get("/registro", (req, res, next) => {
  res.render("registro", { layout: false });
});

//  Pagina de inicio
app.get("/inicio", (req, res, next) => {
  //POKEMONS DE PRUEBA
  const pokemons = [
    {
      name: "Charizard",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png",
      tipo: "Fuego",
    },
    {
      name: "Blastoise",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png",
      tipo: "Agua",
    },
    {
      name: "Pikachu",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
      tipo: "Electrico",
    },
  ];
  if (!req.session.username) {
    res.redirect("/");
  } else {
    let data = {
      username: req.session.username,
      pokemons,
    };
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
      tipo: "Fuego",
    },
    {
      name: "Blastoise",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png",
      tipo: "Agua",
    },
    {
      name: "Pikachu",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
      tipo: "Electrico",
    },
  ];
  if (!req.session.username) {
    res.redirect("/");
  } else {
    res.render("mispokemons", { pokemons });
  }
});
//  Pagina añadir pokemons
app.get("/maspokemons", (req, res, next) => {
  //POKEMONS DE PRUEBA
  const pokemons = [
    {
      name: "Bulbasaur",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
      tipo: "Planta",
    },
    {
      name: "Ivysaur",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/002.png",
      tipo: "Planta",
    },
    {
      name: "Venusaur",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/003.png",
      tipo: "Planta",
    },
    {
      name: "Charmander",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
      tipo: "Fuego",
    },
    {
      name: "Charmeleon",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/005.png",
      tipo: "Fuego",
    },
    {
      name: "Charizard",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png",
      tipo: "Fuego",
    },
    {
      name: "Squirtle",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
      tipo: "Agua",
    },
    {
      name: "Wartortle",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/008.png",
      tipo: "Agua",
    },
    {
      name: "Blastoise",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png",
      tipo: "Agua",
    },
    {
      name: "Pikachu",
      photo: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
      tipo: "Electrico",
    },
  ];
  if (!req.session.username) {
    res.redirect("/");
  } else {
    res.render("maspokemons", { pokemons });
  }
});

//  Ver pokemon
app.get("/verpokemon", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    res.render("verpokemon");
  }
});

//  Pagina cuenta
app.get("/cuenta", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    res.render("cuenta", req.session);
  }
});

//  Pagina contacto
app.get("/contacto", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    res.render("contacto");
  }
});

//  Not found get
app.get("/*", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    let dataNotFound = {
      notFoundImage: "https://images6.alphacoders.com/109/1094097.png",
    };
    res.render("404", dataNotFound);
  }
});
//  -----------------------------------------------------------------------------------

//  Codigo para hacer login
app.post("/login", (req, res, next) => {
  // Recogemos el username y password que ha introducido el usuario
  let username = req.body.inputUsername;
  let password = req.body.inputPassword;

  // Consultamos a la BBDD por el usuario
  MongoClient.connect(url, function (err, client) {
    console.log("Conectado a MongoDB");
    // Client returned
    var db = client.db("users");

    db.collection("users").findOne(
      { username: username },
      function (findErr, result) {
        if (findErr) throw findErr;
        client.close();
        if (password == result.password) {
          req.session.username = req.body.inputUsername;
          req.session.save(function (err) {
            res.redirect("/inicio");
          });
        } else {
          inicioSesionIncorrecto = true;
          res.render("index", { inicioSesionIncorrecto, layout: false });
        }
      }
    );
  });
});
//  Codigo para registrarse
app.post("/registro", (req, res, next) => {});
//  Codigo para cerrar sesion
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

app.use(cookieParser());
app.listen(5000, () => console.log("App listening on port 5000!"));
