import express from "express";
import hbs from "hbs";
import path, { parse } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import session from "express-session";
import Pokedex from "pokedex-promise-v2";
import fs from "fs";
import { devNull } from "os";
import { ADDRGETNETWORKPARAMS } from "dns";

const app = express();
const router = express.Router();
const url = "mongodb://localhost/27017";
const randomBytes = crypto.randomBytes;

const interval = {
  limit: 20,
  offset: 0,
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const P = new Pokedex();
const listaPokemons = [];

var inicioSesionIncorrecto = false;
var registroIncorrecto = false;
var passwordIncorrecta = false;
var usernameIncorrecto = false;


let db;

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

/**********************************************/
// Obtención del los 20 primeros pokemons de la API
// Junto con su posterior carga en la Base de datos

/*
let a = 0;
if (!primeraVez) {
  primeraVez = true;
  P.getPokemonsList(interval).then((respuestaAPI) => {
    //console.log(response.results[0].name);
    //resApiPokemons = JSON.stringify(respuestaAPI.results);
    //console.log(respuestaAPI.results);

    for (let i = 0; i < respuestaAPI.results.length; i++) {
      //Recorro la lista de los pokemons

      P.getPokemonByName(respuestaAPI.results[i].name).then(
        (pokemonBuscado) => {
          //console.log(pokemonBuscado.name, pokemonBuscado.id, pokemonBuscado.types[0].type.name);

          listaPokemons.push({
            id: pokemonBuscado.id,
            name: pokemonBuscado.name,
            type: pokemonBuscado.types[0].type.name,
            sprite: pokemonBuscado.sprites.front_default,
            //sprite: pokemonBuscado.sprites.other.official-artwork.front_default,
          });
          //Ordenamos la lista a cada pokemon obtenido
          listaPokemons.sort(function (a, b) {
            if (a.id > b.id) {
              return 1;
            }
            if (a.id < b.id) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });

          resApiPokemons = JSON.stringify(listaPokemons);

          //console.log(resApiPokemons);

          //fs.createWriteStream("pokemons.json")
          if (a == 19) {
            console.log("He entrado en el if chapuza");
            fs.writeFile(
              "pokemons.json",
              resApiPokemons,
              function (err, result) {
                if (err) console.log("error", err);
              }
            );
          }
          a++;
        }
      );
      console.log(i);
    } // fin del for

    /*
  fs.writeFile("pokemons.json", parseo, function(err, result) {
    if(err) console.log('error', err);
  });//Creo el JSON pokemons.js
  
  });
}
*/

/**********************************************/
/*       Conexión a la base de datos          */
/**********************************************/
MongoClient.connect(url, function (err, client) {
  if (err) throw err;
  console.log("Conectado a MongoDB.");

  db = client.db("capstoneBD"); //Nombre de la BBDD
});

//  CARGAR POKEMONS EN MONGO, SOLO 1 VEZ
/*
MongoClient.connect(url, function (err, client) {
  console.log("Conectado a MongoDB para cargar los Pokemons de la API");
  var db = client.db("capstoneBD"); //nombre base de datos

  let datosLeidos = fs.readFileSync("pokemons.json");
  let dataParsed = JSON.parse(datosLeidos);
  db.collection("pokemons").insertMany(dataParsed);
});
*/
//  -----------------------------------------------------------------------------------
//  RENDERIZACION DE PAGINAS


app.get("/", (req, res, next) => {
  res.render("index", { layout: false });
});

//  Registro
app.get("/registro", (req, res, next) => {
  res.render("registro", { layout: false });
});

//  Inicio tras registrarse
app.get("/inicio", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    let username = req.session.username;
    let pokeIniciales;
    let fotoPerfil;
    let nPokemons;

    db.collection("users").findOne(
      { username: req.session.username },
      function (err, result) {
        if (err) throw err;

        if (result) {
          pokeIniciales = result.pokemons;
          nPokemons = pokeIniciales.length;
          fotoPerfil = pokeIniciales[0].sprite;
        }
        res.render("inicio", {pokeIniciales, username, nPokemons, fotoPerfil});
      }
    );
    
  }
});

//  Ver mis pokemons
app.get("/mispokemons", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    let username = req.session.username;
    
    db.collection("users").findOne(
      { username: req.session.username },
      function (err, result) {
        if (err) throw err;

        let dataPokes = result.pokemons;

        res.render("mispokemons", { dataPokes, username });
      }
    );
  }
});

//  Añadir pokemons a cada usuario
app.post("/anadirpokemon", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    db.collection("pokemons").findOne(
      { name: req.body.name },
      function (err, result) {
        if (err) throw err;
        db.collection("users").updateOne(
          { username: req.session.username },
          { $addToSet: { pokemons: result } }
        );
        res.redirect("mispokemons");
      }
    );
  }
});

// Borrar pokemon seleccionado
app.post("/borrarpokemon", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    db.collection("pokemons").findOne(
      { name: req.body.name },
      function (err, result) {
        if (err) throw err;

        db.collection("users").updateOne(
          { username: req.session.username },
          { $pull: { pokemons: result } }
        );
        let user = req.session.username;
        
        let dataPoke = db
          .collection("users")
          .findOne({ username: req.session.username }, function (err, result) {
            if (err) throw err;

            let dataPokes = result.pokemons;
            res.redirect("mispokemons");
          });
      }
    );
  }
});

//  Pagina ver todos los pokemons y extraerlos
app.get("/maspokemons", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    let username = req.session.username;
    let dataPokes;
    db.collection("pokemons")
      .find({})
      .toArray(function (err, result) {
        if (err) {
          res.send(err);
        } else {
          dataPokes = result;
          res.render("maspokemons", { dataPokes, username });
        }
      });
  }
});

//  Ver el pokemon seleccionado
app.get("/mispokemons/:pokeName", (req, res, next) => {

  let username = req.session.username;
  let pokeElegido;

  if (!req.session.username) {
    res.redirect("/");
  } else {

    db.collection("pokemons").findOne({ name: req.params.pokeName },
      function (err, result) {
        if (err) throw err;
        
        pokeElegido = result;
        res.render("verpokemon", {username, pokeElegido});
      }
    );

  }
});

//  Página cuenta
app.get("/cuenta", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    res.render("cuenta", req.session);
  }
});

//  Página contacto
app.get("/contacto", (req, res, next) => {
  if (!req.session.username) {
    res.redirect("/");
  } else {
    res.render("contacto", req.session);
  }
});

//  Not found 404
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

//  Login
app.post("/login", (req, res, next) => {
  // Recogemos el username y password que ha introducido el usuario
  let username = req.body.inputUsername;
  let password = req.body.inputPassword;

  // Consultamos a la BBDD por el usuario
  db.collection("users").findOne(
    { username: username },
    function (findErr, result) {
      if (findErr) throw findErr;

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

//  Registrarse
app.post("/registro", (req, res, next) => {
  // Recogemos el username y password que ha introducido el usuario
  let username = req.body.inputUsername;
  let password = req.body.inputPassword;
  let pokeElegido;

  // Consultamos a la BBDD por el pokemon elegido por el usuario en el registro.
  db.collection("pokemons").findOne({ name: req.body.name },
    function (err, result) {
      if (err) throw err;
      
      if (result) {
        pokeElegido = [result];
      }
    }
  );

  //Buscamos si ya hay un usuario registrado con ese nombre
  db.collection("users").findOne(
    { username: username },
    function (findErr, result) {
      if (findErr) throw findErr;

      if (!result) {
        //Si no hay ningun usuario con ese nombre en la BBDD, se completa el registro.
        db.collection("users").insertOne(
          { username: username, password: password, pokemons: pokeElegido },
          function (findErr, result) {
            if (findErr) throw findErr;
            //Redirigimos al inicio con la sesion iniciada

            req.session.username = req.body.inputUsername;
            req.session.save(function (err) {
              res.redirect("/inicio");
            });
          }
        );
        //Si ya existe el usuario en la BBDD, no permitimos el registro.
      } else {
        registroIncorrecto = true;
        res.render("registro", { registroIncorrecto, layout: false });
      }
    }
  );
});

// Cerrar sesion
router.get("/logout", (req, res, next) => {
  delete req.session;
  res.redirect("/");
});

//  Cambiar username
app.post("/cambiarusername", (req, res, next) => {
  let newusername = req.body.newusername;

  //Buscamos si ya hay un usuario registrado con ese nombre
  db.collection("users").findOne(
    { username: newusername },
    function (findErr, result) {
      if (findErr) throw findErr;

      //Si no hay ningun usuario con el nuevo nombre, se permite el cambio
      if (!result) {
        MongoClient.connect(url, function (err, client) {
          var db = client.db("capstoneBD");

          db.collection("users").updateOne(
            { username: req.session.username },
            { $set: { username: newusername } },
            function (findErr, result) {
              if (findErr) throw findErr;
              
              req.session.username = newusername;

              req.session.save(function (err) {
                let data = {
                  usernameCambiado: true,
                  username: req.session.username,
                };
                res.render("cuenta", data);
              });
            }
          );
        });
        //Si el nombre escogido ya existe en la BBDD, no permitimos el cambio
      } else {
        usernameIncorrecto = true;
        res.render("cuenta", { usernameIncorrecto });
      }
    }
  );
});

//  Cambiar contraseña
app.post("/cambiarpassword", (req, res, next) => {
  let newpassword = req.body.newpassword;
  let oldpassword = req.body.oldpassword;

  db.collection("users").findOne(
    { username: req.session.username },
    function (findErr, result) {
      if (findErr) throw findErr;

      if (result) {
        if (result.password == oldpassword) {
          db.collection("users").updateOne(
            { username: req.session.username },
            { $set: { password: newpassword } }
          );
          req.session.save(function (err) {
            let data = {
              username: req.session.username,
              passwordCambiada: true,
            };
            res.render("cuenta", data);
          });
        } else {
          passwordIncorrecta = true;
          res.render("cuenta", { passwordIncorrecta });
        }
      } else {
        passwordIncorrecta = true;
        res.render("cuenta", { passwordIncorrecta });
      }
    }
  );
});

//  Borrar cuenta
app.post("/borrarcuenta", (req, res, next) => {
  db.collection("users").deleteOne(
    { username: req.session.username },
    function (findErr, result) {
      if (findErr) throw findErr;

      delete req.session;
      res.redirect("/");
    }
  );
});

app.use(cookieParser());
app.listen(5000, () => console.log("App listening on port 5000!"));
