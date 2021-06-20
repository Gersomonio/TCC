const mysql = require("mysql"); // Importando o MySQL
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({ // Criando a conexão com credenciais do MYSQL.
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) { // Se não houver email ou senha preenchidos nos campos...
            return res.status(400).render('index', {
                message: 'Insira um email e senha'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results);
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('index', {
                    message: 'Email e/ou senha incorretos.'
                })
            } else { // Criação do token de login!
                const id = results[0].id;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, { // Sempre que você tentar criar um token de login para um usuário (com jwt tokens), você tem que passar sua "secret password?"
                    expiresIn: process.env.JWT_EXPIRES_IN //Salvo em .env
                });

                console.log("O token é:" + token);

                const cookieOptions = {
                    expires: new Date( // Expiração do cookie
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000//Data atual + número no .env * hrs no dia * minutos * segundos * milisegundos
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/home");
            }
        });
    } catch (error) {
        console.log(error);
    }
}

exports.register = (req, res) => {
    //console.log(req.body);  // Isso vai pegar os dados do formulário e vai dar log no terminal.

    /*const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;*///

    const { name, email, password, passwordConfirm } = req.body;
    //Async para que o await posteriormente funcione.
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => { //O '?' é uma questão de segurança, o parâmetro é passado em um array.
        if (error) { // Caso dê erro...
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'Email já cadastrado!'
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Senhas inseridas nos campos são diferentes!'
            });
        }
        //Aqui colocamos o que queremos criptografar, quantas vezes.
        let hashedPassword = await bcrypt.hash(password, 8) // Usamos await pois o processo de criptografar pode demorar um pouco mais do que o código precisa para rodar.
        console.log('Senha criptografada: ' + hashedPassword);
        //O primeiro é o campo do DB, o segundo é o valor do FORM
        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'Usuário cadastrado com sucesso!'
                });
            }
        });
    });
}

exports.cadastroCliente = (req, res) => {
    console.log(req.body);

    const { nome, rg, cpf, emailCliente, telefone, celular, nascimento, sexo, nomeDaRua, cep,
        numeroDaRua, complemento, bairro } = req.body;

    db.query('SELECT cpf FROM clientes WHERE cpf = ?', [cpf], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if(results.length > 0) {
            return res.render('cadastroCliente', {
                message: "CPF já cadastrado!"
            });
        }

        //O primeiro é o campo do DB, o segundo é o valor do FORM
        db.query('INSERT INTO clientes SET ?', { nome: nome, rg: rg, cpf: cpf, emailCliente: emailCliente, telefone: telefone,
        celular: celular, nascimento: nascimento, sexo: sexo, nomeDaRua: nomeDaRua, cep: cep, numeroDaRua: numeroDaRua, 
        complemento: complemento, bairro: bairro}, (error, results)=>{
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.render('cadastroCliente', {
                    message: 'Cliente ' + nome + ' cadastrado com sucesso!'
                });
            }
        })
    });
}

exports.agendarConsulta = (req, res) => {
    console.log(req.body);

    const { nome, datahora } = req.body;

    db.query('INSERT INTO agendamentos SET ?', {nome: nome, dataeHora: datahora}, (error, results)=>{
        if(error){
            console.log(error);
        } else {
            console.log(results);
            return res.render('agendarConsulta', {
                message: 'O horário de ' + nome + ' foi marcado com sucesso!'
            });
        }
    })

}