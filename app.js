import express from "express";
import hbs from "hbs";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import session from "express-session";
import Pokedex from "pokedex-promise-v2";
import fs from "fs";

const app = express();
const router = express.Router();
const randomBytes = crypto.randomBytes;

const interval = {
  limit: 15,
  offset: 0,
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const P = new Pokedex();

var inicioSesionIncorrecto = false;
var registroIncorrecto = false;
var sessionGuardada;

app.set("views", __dirname + "/src/views");
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "/src/public")));
hbs.registerPartials(__dirname + "/src/views/partials");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);

app.use(
  session({
    secret: "clavesecretajkdsfn904309gtfi",
    resave: false,
    saveUninitialized: false,
  })
);
/*
var resultados;
P.getPokemonsList(interval).then((response) => {
  console.log(response.results);
  resultados = JSON.stringify(response.results);
  fs.writeFile("pokemons.json", resultados, function (err, result) {
    if (err) console.log("error", err);
  });
});
*/
//  CONEXION CON MONGO
let cityData = fs.readFileSync("pokemons.json");
let cities = JSON.parse(cityData);
const url = "mongodb://localhost/test";
/*
MongoClient.connect(url, function (err, client) {
  console.log("Conectado a MongoDB");
  // Client returned
  var db = client.db("test");
  db.collection("pokemon").insertMany(cities);
  db.collection("pokemon").findOne({}, function (findErr, result) {
    if (findErr) throw findErr;
    //console.log(result.name);
    client.close();
  });
});*/

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
    let data = {
      username: req.session.username,
      pokemons,
    };
    res.render("mispokemons", data);
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
    let data = {
      username: req.session.username,
      pokemons,
    };
    res.render("maspokemons", data);
  }
});

//  Ver pokemon
app.get("/verpokemon", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    res.render("verpokemon", req.session);
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
    res.render("contacto", req.session);
  }
});

//  Not found get
app.get("/*", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    let dataNotFound = {
      notFoundImage: "https://images6.alphacoders.com/109/1094097.png",
      username: req.session.username,
    };
    res.render("404", dataNotFound);
  }
});
//  -----------------------------------------------------------------------------------

//  Codigo para hacer login
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
        if (result) {
          if (password == result.password) {
            req.session.username = req.body.inputUsername;
            req.session.save(function (err) {
              res.redirect("/inicio");
            });
          } else {
            inicioSesionIncorrecto = true;
            res.render("index", { inicioSesionIncorrecto, layout: false });
          }
        } else {
          inicioSesionIncorrecto = true;
          res.render("index", { inicioSesionIncorrecto, layout: false });
        }
      }
    );
  });
});
//  Codigo para registrarse
app.post("/registro", (req, res, next) => {
  // Recogemos el username y password que ha introducido el usuario
  let username = req.body.inputUsername;
  let password = req.body.inputPassword;
  let pokeElegido;

  if (req.body.poke1) {
    pokeElegido = "1"; //Bulbasur
  } else if (req.body.poke4) {
    pokeElegido = "4"; //Charmander
  } else {
    pokeElegido = "7"; //Squirtle
  }

  console.log(username);
  console.log(password);
  // Consultamos a la BBDD por el usuario
  MongoClient.connect(url, function (err, client) {
    var db = client.db("users");
    //Buscamos si ya hay un usuario registrado con ese nombre
    db.collection("users").findOne(
      { username: username },
      function (findErr, result) {
        if (findErr) throw findErr;
        client.close();
        //Si no hay ningun usuario con ese nombre en la BBDD:
        if (!result) {
          MongoClient.connect(url, function (err, client) {
            var db = client.db("users");
            db.collection("users").insertOne(
              { username: username, password: password, pokemons: pokeElegido },
              function (findErr, result) {
                if (findErr) throw findErr;
                //Redirigimos al inicio con la sesion iniciada
                client.close();
                req.session.username = req.body.inputUsername;
                req.session.save(function (err) {
                  res.redirect("/inicio");
                });
              }
            );
          });
        } else {
          registroIncorrecto = true;
          res.render("registro", { registroIncorrecto, layout: false });
        }
      }
    );
  });
});
//  Codigo para cerrar sesion
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

app.use(cookieParser());
app.listen(5000, () => console.log("App listening on port 5000!"));
