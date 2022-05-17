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
import { devNull } from "os";

const app = express();
const router = express.Router();
const url = "mongodb://localhost/27017";
const randomBytes = crypto.randomBytes;


const interval = {
  limit: 15,
  offset: 0,
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const P = new Pokedex();

var inicioSesionIncorrecto = false;
var registroIncorrecto= false;
var passwordIncorrecta = false;
var passwordCambiada = false;
var usernameCambiado = false;
var usernameIncorrecto = false;
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


/**********************************************/
// Obtención del los 15 primeros pokemons de la API
// Junto con su posterior carga en la Base de datos

//          Comentar y descomentar

/**********************************************/
          /*
          let resApiPokemons;
          P.getPokemonsList(interval).then((response) => {
            console.log(response.results);
            resApiPokemons = JSON.stringify(response.results);

            fs.writeFile("pokemons.js", resApiPokemons, function(err, result) {
              if(err) console.log('error', err);
            });//Creo el JSON pokemons.js

          });
          */

          /*
          //      IMPORTANTE. EJECUTAR ESTE CÓDIGO SOLO UNA VEZ
          //  CONEXION CON MONGO para cargar archivo el pokemon.js
          
          let datosLeidos = fs.readFileSync("pokemons.js");
          let dataParsed = JSON.parse(datosLeidos);
          MongoClient.connect(url, function (err, client) {
            console.log("Conectado a MongoDB para cargar los Pokemons de la API");
            var db = client.db("capstoneBD"); //nombre base de datos
           
            db.collection("pokemons").insertMany(dataParsed);
          
          });
          */

/**********************************************/
/**********************************************/

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
  
  if (!req.session.username) {
    res.redirect("/");
  } else {
    let username = req.session.username;
    let pokeIniciales;
    
    MongoClient.connect(url, function (err, client) {
      console.log("Conectado a MongoDB desde inicio");
  
      var db = client.db("capstoneBD"); //Nombre de la BBDD
      db.collection("users").findOne({"username": username}, function(err, result) {
        console.log(result);
        if (err) throw err;
        if(result){
          console.log(result); //Muestra el array devuelto
          pokeIniciales = result.pokemons.toArray();
          
        }else {console.log("No encuentro nada");}
        
      });
      client.close();
    });

    let data = {
      username: req.session.username,
      pokeIniciales,
    };
    res.render("inicio", data);
  }
});

//  Pagina de mis pokemons
app.get("/mispokemons", (req, res, next) => {
  
  if (!req.session.username) {
    res.redirect("/");
  } else {

    MongoClient.connect(url, function (err, client) {
      console.log("Conectado a MongoDB desde mispokemons");
  
      var db = client.db("capstoneBD"); //Nombre de la BBDD
      db.collection("users").find({pokemons}).toArray(function(err, pokeUsuario) {
        if (err) throw err;
        console.log(pokeUsuario); //Muestra el array devuelto
        db.close();
      });
      client.close();
    });

    let data = {
      username: req.session.username,
      pokeUsuario,
    };
    res.render("mispokemons", data);
  }
});

//  Pagina añadir pokemons
app.get("/maspokemons", (req, res, next) => {

  if (!req.session.username) {
    res.redirect("/");
  } else {

    MongoClient.connect(url, function (err, client) {
      console.log("Conectado a MongoDB desde maspokemons");
  
      var db = client.db("capstoneBD"); //Nombre de la BBDD
      db.collection("pokemons").find({}).toArray(function(err, pokeLeidos) {
        if (err) throw err;
        console.log(pokeLeidos); //Muestra el array devuelto
        db.close();
      });
      client.close();
    });

    let data = {
      username: req.session.username,
      pokeLeidos,
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
app.post("/login", (req, res, next) => {
  // Recogemos el username y password que ha introducido el usuario
  let username = req.body.inputUsername;
  let password = req.body.inputPassword;

  // Consultamos a la BBDD por el usuario
  MongoClient.connect(url, function (err, client) {
    // Client returned
    var db = client.db("capstoneBD");
    console.log("Conectado a la base de datos desde el post del login.");

    db.collection("users").findOne({"username" : username}, function (findErr, result) {
      if (findErr) throw findErr;
      
      client.close();
      if(result){
        if (password == result.password){
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
      
    });
      
  });
});

//  Codigo para registrarse
app.post("/registro", (req, res, next) => {
    // Recogemos el username y password que ha introducido el usuario
    let username = req.body.inputUsername;
    let password = req.body.inputPassword;
    let pokeElegido;

    if(req.body.bulbasaur){

      // Consultamos a la BBDD por el pokemon elegido.
      MongoClient.connect(url, function (err, client) {
        console.log("Conecto a la BD en busca de bulbasaur.");
        var db = client.db("capstoneBD"); //Nombre BBDD
        
        db.collection("pokemons").findOne({"name" : "bulbasaur"}, function (findErr, result) {
          console.log("Query de bulbasaur.");
          console.log(result);
          if (findErr) throw findErr;
          // db.collection("users").updateOne({item: "pokemons", result});
          if(result){
            pokeElegido = result;
          }
          
        });
        client.close();
      });

    }else if(req.body.charmander){

      // Consultamos a la BBDD por el pokemon elegido.
      MongoClient.connect(url, function (err, client) {
        console.log("Conecto a la BD en busca de charmander.");
        var db = client.db("capstoneBD"); //Nombre BBDD
        
        db.collection("pokemons").findOne({name : "charmander"}, function (findErr, result) {
          if (findErr) throw findErr;
          
          if(result){
            pokeElegido = result;
          }
          
        });
        client.close();
      });
    }else if(req.body.squirtle){
      // Consultamos a la BBDD por el pokemon elegido.
      MongoClient.connect(url, function (err, client) {
        console.log("Conecto a la BD en busca de squirtle.");
        var db = client.db("capstoneBD"); 
        
        db.collection("pokemons").findOne({name : "squirtle"}, function (findErr, result) {
          if (findErr) throw findErr;
          
          if(result){
            pokeElegido = result;
          }
        
        });
        client.close();
      });
    }

   
    // Consultamos a la BBDD por el usuario
    MongoClient.connect(url, function (err, client) {
      var db = client.db("capstoneBD"); //Nombre BBDD
      console.log("Conecto a la BD en busca del user en registro.");
      //Buscamos si ya hay un usuario registrado con ese nombre
      db.collection("users").findOne({"username" : username}, function (findErr, result) {
        if (findErr) throw findErr;
        client.close();
        
        if (!result){ //Si no hay ningun usuario con ese nombre en la BBDD:
          MongoClient.connect(url, function (err, client) {
            var db = client.db("capstoneBD");

            db.collection("users").insertOne({"username" : username, "password" : password, "pokemons": pokeElegido}, function (findErr, result) {
              if (findErr) throw findErr;
              //Redirigimos al inicio con la sesion iniciada
              client.close();
              req.session.username = req.body.inputUsername;
              req.session.save(function (err) {
                res.redirect("/inicio"); 
              });
            });
          });
        } else {
          registroIncorrecto = true;
          res.render("registro", { registroIncorrecto, layout: false });
        }
       
      });
    });
});

//  Codigo para cerrar sesion
router.get("/logout", (req, res, next) => {
  delete req.session;
  res.redirect("/");
});

//  Codigo para cambiar username
app.post("/cambiarusername", (req, res, next) => {
  let newusername = req.body.newusername;
  console.log(newusername, req.session.username);
  
  MongoClient.connect(url, function (err, client) {
    var db = client.db("capstoneBD");
    //Buscamos si ya hay un usuario registrado con ese nombre
    db.collection("users").findOne({"username" : newusername}, function (findErr, result) {
      if (findErr) throw findErr;
      client.close();
      //Si no hay ningun usuario con ese nombre en la BBDD:
      if (!result){
        MongoClient.connect(url, function (err, client) {
          var db = client.db("capstoneBD");

          db.collection("users").updateOne({"username" : req.session.username}, {$set: {"username" : newusername}}, function (findErr, result) {
            if (findErr) throw findErr;
            //Redirigimos cambiando el username en la sesion
            client.close();
            req.session.username = newusername;
            
            req.session.save(function (err) {
              let data = {
                username: req.session.username
                
              };
              res.render("cuenta", data); 
            });
          });
        });
      } else {
        usernameIncorrecto = true;
        res.render("cuenta", { usernameIncorrecto});
      }
     
    });
  });
});

//  Codigo para cambiar contraseña
app.post("/cambiarpassword", (req, res, next) => {

  let newpassword = req.body.newpassword;
  let oldpassword = req.body.oldpassword;
  
  MongoClient.connect(url, function (err, client) {
    var db = client.db("capstoneBD"); //Nombre BBDD
    
    db.collection("users").findOne({"username" : req.session.username}, function (findErr, result) {
      if (findErr) throw findErr;

      client.close();
      if(result){
        if (result.password == oldpassword){
          MongoClient.connect(url, function (err, client) {
            var db = client.db("users");
            db.collection("users").updateOne({"username" : req.session.username}, {$set: {"password" : newpassword}}, function (findErr, result) {
              if (findErr) throw findErr;
              client.close();
            });
              
              
            
          });
          req.session.save(function (err) {
            let data = {
              username: req.session.username,
              passwordCambiada : true
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
      
    });
      
  });
});


app.use(cookieParser());
app.listen(5000, () => console.log("App listening on port 5000!"));
