const express = require("express");
const app = express();
//for dcrpt
const bcrypt = require('bcryptjs');
const studentController = require("./controller/studentController");
require("./Config/DB.js");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs");//gobal call garnu ko lagi

//database
const db = require("./model/index");
db.sequelize.sync({ force: false }); 

//calling from the controller
app.get("/", studentController.index);
app.post("/register", studentController.createStudent);
app.get("/login", studentController.renderLogin);
app.post("/login", studentController.loginStudent);

app.listen(4000, () => {
    console.log("Node server started at port 4000");
  });