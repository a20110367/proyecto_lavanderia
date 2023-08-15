const express = require('express');
const app = express();
const cors = require("cors");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + 'public'));

app.set('view engine', 'ejs');

const bcryptjs = require('bcryptjs');

const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Saber donde esta la carpeta y archivos estaticos
//console.log(__dirname);

const connection = require('./database/db');


app.get('/', (req, res) => {
    res.render('index', { msg: 'Corneta' });
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const user = req.body.user;
    const email = req.body.email;
    const phone = req.body.phone;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let pwHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', { nombre: user, email: email, phone: phone, rol: rol, pass: pwHaash }, async (error, results) => {
        if (error) {
            console.log('El error es: ' + error);
            return;
        } else {
            console.log('¡Agregado!');
            res.render('register', {
                alert: true,
                alertTitle: "Registration",
                alertMessage: "¡Succesful Registration!",
                alertIcon: 'success',
                showConfirmButton: false,
                time: 1500,
                ruta: ''
            });
        }
    })
})

app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    if (user && pass) {
        connection.query('SELECT * FROM users WHERE nombre = ?', [user], async (error, results) => {
            if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o Contraseña Incorrectos",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    time: false,
                    ruta: 'login'
                });
            }else {
                req.session.name = results[0].name
                res.render('login', {
                    alert: true,
                    alertTitle: "Conexion Exitosa",
                    alertMessage: "¡Bienvenidos!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    time: 1500,
                    ruta: ''
                });
            }
        })
    }else {
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Contraseña o Password Vacios o Incorrectos!",
            alertIcon: 'warning',
            showConfirmButton: true,
            time: false,
            ruta: 'login'
        });
    }
})

app.listen(5000, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:5000');
})