const express = require("express");
const mysql = require("mysql");
const app = express();
require("dotenv").config();
var session = require('express-session');
var flush = require('connect-flash');
const nodemailer = require('nodemailer');
const database = require("./database");

let conexion = mysql.createConnection({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000},
    resave: false,
    saveUninitialized: false
}));
app.use(flush());

//Rutas ::::::::::::::::::::::::::::::::::::::::::::::::

app.get("/", (req,res) => {
    res.render("login", {message: req.flash('message')});
})


app.get("/register", (req,res) => {
    res.render("register", {message: req.flash('message')});
})

app.get("/forgotPassword", (req,res) => {
    res.render("forgotpassword", {message: req.flash('message')});
})

app.get("/productos", async(req,res) => {
    const connexition = await database.getConnection()
    const result = await connexition.query("SELECT * FROM tabla_producto");
    res.json(result);
})

app.get("/principal", (req, res) => {
    res.render("principal", {message: req.flash('message')});
})

app.get("/profile", (req,res) => {
    res.render("profile", {message: req.flash('message')});
})

app.get("/carrito", (req,res) => {
    res.render("carrito", {message: req.flash('message')});
})

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public/SobreNosotros"));

//Fin de las rutas :::::::::::::::::::::::::::::::::::::

//De aqui va solo para la pagina de hacer el login :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

app.post("/validarLogin", function(req, resL) {
    const datos = req.body;
    let nickname = datos.userLo;
    let password = datos.passwordLo;

    let buscarNick = 'SELECT * FROM cliente WHERE nickname = "'+nickname+'"';

    conexion.query(buscarNick, (err, res) => {
        if(err) throw err;
        else{
            if(res.length > 0) {
                var data = JSON.parse(JSON.stringify(res))
                if (data[0].contrasenia == password) {
                    console.log("Bienvenide "+data[0].nickname)
                    resL.redirect("/principal");
                }
                else{
                    req.flash('message', 'USUARIO O CONTRASEÑA INCORRECTA');
                    resL.redirect('/')
                }
            } else{
                req.flash('message', 'USUARIO O CONTRASEÑA INCORRECTA');
                resL.redirect('/')
            }
        }
    })

    console.log(datos)
});

//De aqui va solo para la pagina de registrarse :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

app.post("/validarRegistro", (req, resL) => {
    const datos = req.body;
    let nombre = datos.nombreInput;
    let apellido = datos.apellidoInput;
    let email = datos.emailInput;
    let cedula = datos.cedulaInput;
    let password = datos.passwordInput;
    let nickname = datos.userInput;

    let buscarCe = "SELECT * FROM cliente WHERE id = "+cedula+"";
    let buscarEmail = 'SELECT * FROM cliente WHERE email = "'+email+'"';
    let buscarNick = 'SELECT * FROM cliente WHERE nickname = "'+nickname+'"';

    conexion.query(buscarCe, (err, res) => {
        if(err) throw err;
        else{
            if(res.length>0){
                console.log("No se puede registrar, cedula ya registrada");
                req.flash('message', 'CEDULA YA EXISTE NO SE PUEDE REGISTRAR');
                resL.redirect('/register')
            } else {
                conexion.query(buscarEmail, (err, res) => {
                    if(err) throw err;
                    else{
                        if(res.length>0){
                            console.log("No se puede registrar, email ya registrado");
                            req.flash('message', 'EMAIL YA EXISTE NO SE PUEDE REGISTRAR');
                            resL.redirect('/register')
                        } else {
                            conexion.query(buscarNick, (err, res) => {
                                if(err) throw err;
                                else{
                                    if(res.length>0){
                                        console.log("No se puede registrar, nickname ya registrado");
                                        req.flash('message', 'NICKNAME YA EXISTE NO SE PUEDE REGISTRAR');
                                        resL.redirect('/register')
                                    } else {
                                        let registrar = "INSERT INTO cliente (id,nombre,apellido,contrasenia,nickname,email) VALUES ('"+cedula+"','"+nombre+"','"+apellido+"','"+password+"','"+nickname+"','"+email+"')";
                                        conexion.query(registrar, (err) => {
                                            if(err) throw err;
                                            console.log("Datos guardados exitosamente")
                                            resL.redirect("/");
                                        });
                                    }
                                }
                            })
            
                        }
                    }
                })

            }
        }
    })

    
});

//Hasta acá :::::::::::::::::::::::::::::::::::::::::::::::::::

app.post("/sendNudes", (req, resD) => {
    const datos = req.body;
    let email = datos.inputLogin;

    let consultaEmail = 'SELECT * FROM cliente WHERE email = "'+email+'"';

    conexion.query(consultaEmail, async(err, res) => {
        if(err) throw err;
        if (res.length>0) {
            var data = JSON.parse(JSON.stringify(res))
            console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::")
            try {
                await transporter.sendMail({
                    from: '"Forgot password 👻" <beepabuence@gmail.com>', // sender address
                    to: data[0].email, // list of receivers
                    subject: "Forgot password 👻", // Subject line
                    html: "<h2>Parece que olvidaste tu usuario y contraseña :( es la siguiente bb </h2>"+
                        "<br><br><h3>"+data[0].nickname+"<br>"+data[0].contrasenia+"</h3>", // html body
                });
                resD.redirect("/");
            } catch (error) {
                console.log(error)
            }
        } else {
            req.flash('message', 'CORREO ELECTRONICO NO EXISTE EN BASES');
            resD.redirect('/')
        }
    })

})

// Hacer recordación de datos::::::::::::::::::::::::::::::::::::::

//Hasta aca ::::::::::::::::::::::::::::::::::::::::::::::::::::::

app.listen(3003, function () {
    console.log("Servidor creado en http://localhost:3003")
})

//Invocando para enviar correos electronicos s


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.email,
      pass: process.env.passwordEmail,
    },
  });

  transporter.verify().then( ()=> {
    console.log("Lista para enviar todo");
  })