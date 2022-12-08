//Name: Artem Pankov
//Student Number: 109060210
//Cyclic: https://vast-frog-sweatsuit.cyclic.app/

var express = require("express");

var app = express();

const mod = require("./final")

app.use(express.json());

app.use(express.urlencoded({extended: true}));

var HTTP_PORT = process.env.PORT || 8080;

app.get("/",(req,res)=>{
    res.sendFile('./home.html', {root: __dirname });
});

app.get("/register", function(req, res) {
    res.sendFile('./register.html', {root: __dirname });
  });

  app.post("/register", function(req, res) {
    mod.register(req.body)
    .then((data) => res.send("<p>" + data.email + " registered successfully <p> <br> <a href='/'>Go Home</a>"))
    .catch((err)=> {
        console.log(err);
        res.send(err);
    });
});

app.get("/signin", function(req, res) {
    res.sendFile('./signin.html', {root: __dirname });
  });

  app.post("/signin", function(req, res) {
    mod.signIn(req.body)
    .then((data) => res.send("<p>" + data.email + " signed in successfully <p> <br> <a href='/'>Go Home</a>"))
    .catch((err)=> {
        console.log(err);
        res.send(err);
    });
});

app.get("*", (req, res) => {
    res.status(404).send('Not found');
});

mod.startDB().then(
app.listen(HTTP_PORT, function(){
    console.log("app listening on: " + HTTP_PORT)
    })).catch((err) => console.log(err));