const { name } = require("ejs");
const db = require("../model/index");
const Student = db.student;
const bcrypt = require("bcryptjs");

exports.index = async(req,res) => {
    res.render("index");
};

exports.renderLogin = async(req,res)=>{
    res.render("login");
}


exports.createStudent = async(req,res) =>{
    console.log(req.body)
    //destructuring objects
    const {name,email,address,password}=req.body 
    
    // const name = req.body.name;
    // const email = req.body.email;
    // const address = req.body.address;
    // const contact = req.body.contact;
    // in short way to write it.....
    

    //adding in database tabel
    db.student.create({
        // Name : name,(If the columne name is different in table ,table columne name 1st and object 2nd)
        name,
        email,
        address,
        password: bcrypt.hashSync(password,12),
    })
    // redirecting to another page
    res.redirect('/login')
}

    // for login
    exports.loginStudent= async(req,res) =>{
        console.log(req.body)
        const {password,email} = req.body
        console.log(email,password);

        const foundStudent = await db.student.findAll({
            where:{
                email: email,
    
            }
        });

        if(foundStudent.length==0){     //checking if email exists
            return res.redirect("/login");   
        }
    
        console.log(foundStudent[0].password);
        console.log(bcrypt.compareSync(password,foundStudent[0].password));
    
        if(bcrypt.compareSync(password,foundStudent[0].password)){ 
            res.redirect("/home");
        } else{
            res.redirect("/login");    
        }
    
        // if(foundStudent.length==0){
        //     return res.redirect("/login");
        // }

        // console.log(foundStudent[0].password);// to get the password only
        // console.log(bcrypt.compareSycnc(password,foundStudent[0].password));//to check the password is right 
        

        // if(bcrypt.compareSycnc(password,foundStudent[0].password)){
        // res.redirect('/home');
        // }else{
        //     res.redirect("/login");
        // }

}

    

