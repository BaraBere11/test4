var fs = require("fs");

var students=[];

const Sequelize = require('sequelize');

var sequelize = new Sequelize('fwtcatjv', 'fwtcatjv', 'lmzSwFFbfL01KuZaHlTScvCW3gtlflxp', {
    host: 'lucky.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true
   },
   query:{raw: true} // update here, you. Need this
   }); 

   sequelize.authenticate().then(()=> console.log('Connection success.'))
.catch((err)=>console.log("Unable to connect to DB.", err));

var Student = sequelize.define('Student', {
    StudId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
    program: Sequelize.STRING,
    gpa: Sequelize.FLOAT
});

exports.prep = ()=>{
    return new Promise(function(resolve, reject) {
        sequelize.sync().then(resolve()).catch(() =>reject("unable to sync the database"));
    });
};



exports.bsd = ()=>{

    return new Promise(function(resolve, reject) {
        Student.findAll({
            where: {
                program: 'BSD'
            }
        }).then(data => resolve(data))
            .catch(() =>reject("no results returned."));
    })

}





exports.cpa = ()=>{

    return new Promise(function(resolve, reject) {
        Student.findAll({
            where: {
                program: 'CPA'
            }
        }).then(data => resolve(data))
            .catch(() =>reject("no results returned."));
    })

}

exports.highGPA = ()=>{

    return new Promise((resolve, reject)=>{

        Student.findAll({
            order: [
                 ['gpa', 'DESC'],
            ],
        }).then((data) => resolve(data[0])).catch(() => console.log("unable"));

    }); 

};



exports.lowGPA = ()=>{

    return new Promise((resolve, reject)=>{

        Student.findAll({
            order: [
                 ['gpa', 'ASC'],
            ],
        }).then((data) => resolve(data[0])).catch(() => console.log("unable"));

    }); 

};



exports.allStudents =()=>{

    return new Promise(function(resolve, reject) {
        Student.findAll().then(data => resolve(data)).catch(() =>reject("no results returned"));
    })

}



exports.addStudent= (stud)=>{

    return new Promise(function(resolve, reject) {
        for (var i in stud) {
        if (i == "") {
            i = null;
        }
        }   
        Student.create(stud).then(resolve()).catch(() => reject("unable to create student"));
    })

}



exports.getStudent = (studId)=>{

    return new Promise(function(resolve, reject) {
        Student.findOne({
            where: {
                StudId: studId
            }
        }).then(data => resolve(data))
            .catch(() =>reject("no results returned."));
    })

}

