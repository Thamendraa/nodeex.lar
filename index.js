const express = require("express");
const app = express();
const path =require("path");

//for dcrypt
const bcrypt = require('bcryptjs');
const studentController = require("./controller/studentController");
require("./Config/DB.js");
const{storage,multer}= require('./services/molterConfig')
const upload = multer({storage:storage})

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.set("view engine","ejs");//gobal call garnu ko lagi

//database
const db = require("./model/index");
db.sequelize.sync({ force: false }); 

//calling from the controller
app.get("/", studentController.index);

app.post("/register",upload.single('image'), studentController.createStudent);//middleware

app.get("/login", studentController.renderLogin);

app.post("/login", studentController.loginStudent);

app.use(express.static(path.join(__dirname,"uploads")));

app.get("/email", studentController.renderEmail);

app.post("/email", studentController.email);

app.listen(4000, () => {
    console.log("Node server started at port 4000");
  });