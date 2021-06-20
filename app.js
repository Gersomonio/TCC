const express = require("express"); // Importando o Express para startar o server NodeJS.
const path = require("path");
const mysql = require("mysql"); // Importando o MySQL
const dotenv = require("dotenv"); // Requerindo o dotenv usado para proteger informações.
const cookieParser = require("cookie-parser"); // Requerindo o cookie-parser

dotenv.config({ path: './.env'}) // Temos que dizer ao dotenv onde estão as variáveis que queremos proteger! 
                                 //Lembrando que é possível dar nome ao arquivo env, contanto que seja .env a extensão.
const app = express(); // Para ter certeza de que o servidor seja iniciado.

const db = mysql.createPool({ // Criando a conexão com credenciais do MYSQL.
    connectionLimit: 100,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
                                 //__dirname é uma variável do NodeJS que te dá acesso ao diretório atual.
const publicDirectory = path.join(__dirname, './public');  //publicDirectory seria onde colocaremos qualquer arquivo como CSS's, Javascript para Front-end, etc.
const imgDirectory = path.join(__dirname, './public/img');
const styleDirectory = path.join(__dirname, './public/css');
console.log(imgDirectory); 
console.log(__dirname); // Mostra qual é o diretório no console.

app.use(express.static(publicDirectory));
app.use(cookieParser());

app.use('/img', express.static(imgDirectory));
app.use('/style', express.static(styleDirectory))

//Esse comando vai dar PARSE em url-encoded bodies (enviados por formulário html)
app.use(express.urlencoded({ extended: false }));
//Os valores que estamos pegando do FORM virão como Json's através de outro PARSE
app.use(express.json());

app.set('view engine', 'hbs'); // É necessário dizer ao NODE qual view engine você quer usar.

db.getConnection((err) => {
    if (err) { // Se ocorrer um erro...
        console.log(err);
    } else { // Se for conectado com sucesso...
        console.log("Conectado ao MYSQL!");
    }
});

//Definir rotas
app.use('/', require('./routes/pages')); //Quando for acessado o diretório '/', a aplicação vai requerir as rotas do pages.js
app.use('/auth', require('./routes/auth')); //Quando o /auth for acessado, a aplicação vai requerir as rotas de /routes/auth

const pdfRoute = require('./routes/pdfmake');
app.use('/pdfMake', pdfRoute);

app.listen(3333, () => {
    console.log("Servidor iniciado na porta 3333.");
});