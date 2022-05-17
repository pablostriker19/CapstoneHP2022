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

const app = express();
const router = express.Router();
const url = "mongodb://localhost/test";
const randomBytes = crypto.randomBytes;


const interval = {
  limit: 15,
  offset: 0,
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const P = new Pokedex();

var inicioSesionIncorrecto = false;

var fs;
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

/**********************************************
          let resApiPokemons;
          P.getPokemonsList(interval).then((response) => {
            console.log(response.results);
            resApiPokemons = JSON.stringify(response.results);

            fs.writeFile("pokemons.js", resApiPokemons);//Creo el JSON pokemons.js

          });


          //  CONEXION CON MONGO para cargar archivo el data.js
          /*
          MongoClient.connect(url, function (err, client) {
            var db = client.db("test"); //nombre base de datos
            db.collection("pokemon").insertMany("pokemons.js");
            
            client.close();
          });*/

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

    MongoClient.connect(url, function (err, client) {
      console.log("Conectado a MongoDB desde inicio");
  
      var db = client.db("users"); //Nombre de la BBDD
      db.collection("users").find({pokemons}).toArray(function(err, pokeIniciales) {
        if (err) throw err;
        console.log(pokeIniciales); //Muestra el array devuelto
        db.close();
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
  
      var db = client.db("users"); //Nombre de la BBDD
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

  
  //POKEMONS DE PRUEBA
  /*
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
  ];*/
  if (!req.session.username) {
    res.redirect("/");
  } else {

    MongoClient.connect(url, function (err, client) {
      console.log("Conectado a MongoDB desde maspokemons");
  
      var db = client.db("users"); //Nombre de la BBDD
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
    var db = client.db("users");
    
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

    if(req.body.poke1){

      // Consultamos a la BBDD por el pokemon elegido.
      MongoClient.connect(url, function (err, client) {
        
        var db = client.db("users"); //Nombre BBDD
        
        db.collection("pokemons").findOne({"name" : "bulbasur"}, function (findErr, result) {
          if (findErr) throw findErr;
          // db.collection("users").updateOne({item: "pokemons", result});
          if(result){
            pokeElegido = result;
          }
          db.close();
        });
        client.close();
      });

    }else if(req.body.poke4){

      // Consultamos a la BBDD por el pokemon elegido.
      MongoClient.connect(url, function (err, client) {
        
        var db = client.db("users"); //Nombre BBDD
        
        db.collection("pokemons").findOne({"name" : "charmander"}, function (findErr, result) {
          if (findErr) throw findErr;
          
          if(result){
            pokeElegido = result;
          }
          db.close();
        });
        client.close();
      });
    }else{
      // Consultamos a la BBDD por el pokemon elegido.
      MongoClient.connect(url, function (err, client) {
        
        var db = client.db("users"); //Nombre BBDD
        
        db.collection("pokemons").findOne({"name" : "squirtle"}, function (findErr, result) {
          if (findErr) throw findErr;
          
          if(result){
            pokeElegido = result;
          }
          db.close();
        });
        client.close();
      });
    }

   
    // Consultamos a la BBDD por el usuario
    MongoClient.connect(url, function (err, client) {
      var db = client.db("users");
      //Buscamos si ya hay un usuario registrado con ese nombre
      db.collection("users").findOne({"username" : username}, function (findErr, result) {
        if (findErr) throw findErr;
        client.close();
        //Si no hay ningun usuario con ese nombre en la BBDD:
        if (!result){
          MongoClient.connect(url, function (err, client) {
            var db = client.db("users");
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
    var db = client.db("users");
    //Buscamos si ya hay un usuario registrado con ese nombre
    db.collection("users").findOne({"username" : newusername}, function (findErr, result) {
      if (findErr) throw findErr;
      client.close();
      //Si no hay ningun usuario con ese nombre en la BBDD:
      if (!result){
        MongoClient.connect(url, function (err, client) {
          var db = client.db("users");
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
    var db = client.db("users");
    
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
