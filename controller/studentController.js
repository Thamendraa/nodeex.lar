const { name } = require("ejs");
const db = require("../model/index");
const Student = db.student;
const bcrypt = require("bcryptjs");
const sendEmail = require("../services/sendEmail");
const { text } = require("express");

exports.index = async (req, res) => {
  res.render("index");
};

exports.renderLogin = async (req, res) => {
  res.render("login");
};

exports.createStudent = async (req, res) => {
  console.log(req.file);
  //destructuring objects
  const { name, email, address, password, image } = req.body;

  // const name = req.body.name;
  // const email = req.body.email;
  // const address = req.body.address;
  // const contact = req.body.contact;
  // in short way to write it.....

  //adding in database tabel
  const created = await db.student.create({
    // Name : name,(If the columne name is different in table ,table columne name 1st and object 2nd)
    name,
    email,
    address,
    password: bcrypt.hashSync(password, 12),
    image: req.file.filename,
    // or image: "http://localhost:4000/"+req.file.filename,
  });
  console.log(created);

  await sendEmail({
    to: email,
    text: "SucessFully registered",
    subject: "SUSC",
  });
  // redirecting to another page
  res.redirect("/login");
};

// for login
exports.loginStudent = async (req, res) => {
  console.log(req.body);
  const { password, email } = req.body;
  console.log(email, password);

  const foundStudent = await db.student.findAll({
    where: {
      email: email,
    },
  });

  if (foundStudent.length == 0) {
    //checking if email exists
    return res.redirect("/login");
  }

  console.log(foundStudent[0].password);
  console.log(bcrypt.compareSync(password, foundStudent[0].password));

  if (bcrypt.compareSync(password, foundStudent[0].password)) {
    res.redirect("/home");
  } else {
    res.redirect("/login");
  }
};

//email ejs dislapy get
exports.renderEmail = async (req, res) => {
  res.render("email");
};

// email post

exports.email = async (req, res) => {
  try {
    const { message, subject } = req.body;
    console.log(message, subject);

    //finding email from database
    const allUsers = await db.student.findAll({});

    allUsers.forEach(async (user) => {
      await sendEmail({
        to: user.email,
        text: message,
        subject: subject,
      });
    });
  } catch {
    console.log("error sending mail");
    res.render("error");
  }
};

// forget password
exports.renderFpassword = async (req, res) => {
  res.render("forgotPassword");
};

exports.rederResetPwd = async (req, res) => {
  res.render("resetPwd");
};

// reset pwd
exports.verifyEmail = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  const isFound = await db.student.findAll({
    where: {
      email: email,
    },
  });
  console.log(isFound);
  if (isFound.length == 0) {
    console.log("email not found");
    return res.redirect("/forgotPassword");
  } else {
    console.log("email found");
    try {
      const randomOTP = Math.floor(100000 + Math.random() * 900000);
      const message = "your OTP is R-" + randomOTP + ".";
      await sendEmail({
        to: email,
        text: message,
        subject: "SUSC",
      });

      console.log("eamail send");
      isFound[0].otp = randomOTP;
      await isFound[0].save();
    } catch (e) {
      console.log("error sending mail");
      res.render("error");
    }
    return res.redirect("/resetPwd");
  }
};

// after otp
exports.newPassword = async (req, res) => {
  const { otp, password } = req.body;
  console.log(otp, password);

  const encPassword = bcrypt.hashSync(password, 12);

  const foundOTP = await db.student.findAll({
    //verify the entered otp is match to the otp in database table
    where: {
      otp: otp,
    },
  });
  if (foundOTP.length != 0) {
    //update the old password with the new password and make otp null
    (foundOTP[0].password = encPassword),
      (foundOTP[0].otp = null),
      await foundOTP[0].save();
  } else {
    console.log("otp no match");
    res.redirect("/restPassword");
  }
  return res.redirect("/login");
};
