const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  "email":  {
    type: String,
    unique: true
  },
  "password": String
});
var finalUsers = mongoose.model("test", userSchema);

function startDB() {
  return new Promise(function(resolve, reject) {
      mongoose.connect("mongodb+srv://apankov:qwerty321@test1.rgzumzb.mongodb.net/?retryWrites=true&w=majority")
      .then(() => {
        console.log("DB connection successful.");
        resolve();
      }).catch((err)=>{
        console.log("Unable to connect");
        reject(err);
    });
  });
}

function register(user) {
  return new Promise(function(resolve, reject){
    if (user.password == null || user.password[0] == ' ' || user.email== null || user.email[0] == ' ') {
      reject("Error: email or password cannot be empty.");
    }
    var newUser = new finalUsers(user); 
    bcrypt.hash(user.password, 10).then((res)=>{
      newUser.password = res;
      }).catch(() => reject("There was an error encrypting the password"));
      newUser.save(function(err) {
        if (err) {
            if (err.code == 11000) {
                reject("Error:" + user.email + "already exists");
            } else {
                reject("Error: cannot create the user");
            }
        } else {
            resolve(user);
        }
    });

  })
}

function signIn(userData) {
  return new Promise(function(resolve, reject){
    finalUsers.findOne({email: userData.email})
    .exec()
    .then((foundUser) => {
      if (foundUser == null) {
        reject("Cannot find the user: " + userData.email);
      }
      else if (!bcrypt.compare(userData.password, foundUser.password)) {
        reject("Incorrect Password for user:" + userData.email);
      }
      else {
          resolve(userData);
      }
    }).catch("Unable to find the user: " + userData.userName)
  })
}



module.exports = {startDB, register, signIn};
