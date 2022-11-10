var express = require("express");

var app = express();

var data_prep = require("./data_prep.js");

var path = require("path");
var exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({
    extname:".hbs" ,
    defaultLayout: "main",
    helpers: { 
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
           } 
    }
}));
app.set("view engine", ".hbs");


app.use(express.json());

app.use(express.urlencoded({extended: true}));



var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() 

{

    console.log("Express http server listening on " + HTTP_PORT);

}



app.get("/",(req,res)=>{
    res.render('home');
});



app.get("/BSD", (req,res)=>{

    data_prep.bsd().then((data)=>{

        res.json(data);

    }).catch((reason)=>{

        res.json({message:reason});

    });

});



app.get("/CPA", (req,res)=>{

    var cpastud = [];
    data_prep.cpa().then(value => {
        for (let i = 0; i < value.length; i++) {
        cpastud.push(value[i]);
    }
    res.render('students', {cpastud: cpastud});

    }).catch((reason)=>{

        res.json({message:reason});

    });

});



app.get("/highGPA", (req, res)=>{

    data_prep.highGPA().then((data)=>{

        res.render('student', data);

    });

});



app.get("/allStudents", (req, res)=>{

    var cpastud = [];
    data_prep.allStudents().then(value => {
        for (let i = 0; i < value.length; i++) {
        cpastud.push(value[i]);
    }
    res.render('students', {cpastud: cpastud});

    }).catch((reason)=>{

        res.json({message:reason});

    });

});



app.get("/addStudent", (req, res)=>{

    res.sendFile(path.join(__dirname, "/test3_views/addStudent.html"));

});



app.post("/addStudent", (req, res)=>{

    data_prep.addStudent(req.body).then(()=>{

        var data = req.body;

        res.render('student', data);

        //res.redirect("/allStudents");



    }).catch((reason)=>res.json({message:reason}));

});



app.get("/student/:studId",(req, res)=>{

    data_prep.getStudent(req.params.studId).then((data)=>{

        res.render('student', data);

       // res.json(data);

       // {"studId":3,"name":"name3","program":"BSD","gpa":3.3}

    }).catch((reason)=>res.json({message:reason}));

});



app.get("*", (req, res)=>{

    res.status(404).send("Error 404: page not found.")

});



data_prep.prep().then((data)=>{

    //console.log(data);

    app.listen(HTTP_PORT, onHttpStart);

}).catch((err)=>{

    console.log(err);

});