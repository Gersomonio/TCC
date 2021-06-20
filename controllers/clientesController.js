const { policysimulator } = require('googleapis/build/src/apis/policysimulator');
const mysql = require('mysql');

//Criando conexão ao banco novamente (EM CADA CONTROLLER É NECESSÁRIA A RECONEXÃO POR CONTA DA POOL)
const db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//Transmitir os clientes para a view
exports.view = (req, res) => {

    //Conectando ao banco
    db.getConnection((err, connection) => {
        if (err) throw err; // Caso dê erro, não conecta.
        console.log('Conectado na Pool como: ' + connection.threadId); // Caso dê certo, dá esse log

        //Usando a conexão
        connection.query('SELECT * FROM clientes', (error, rows) => {
            //Quando finalizar a conexão...
            connection.release();

            if (!err) {
                res.render('gerenciarClientes', { rows });
            } else {
                console.log(error);
            }

            console.log('Os dados da tabela de clientes são: \n', rows);
        });
    })
}

// Editar cliente
exports.edit = (req, res) => {
    //Pegar slot de conexão na Pool
    db.getConnection((err, connection) => {
        if (err) throw err; // Se der erro, não conecta
        console.log('Conectado na Pool como: ' + connection.threadId);
        //Usar a conexão
        connection.query('SELECT * FROM clientes WHERE id = ?', [req.params.id], (err, rows) => {
            //Quando finalizar a conexão...
            connection.release();
            if (!err) { // Se !NÃO houver erro...
               return res.render('editarCliente', { rows });
                
            } else {
                console.log(err);
            }
            console.log('Os dados da tabela de clientes são: \n', rows)
        });
    });
}

// Atualizar dados do Cliente
exports.update = (req, res) => {
    const { nome, rg, cpf, emailCliente, telefone, celular, nascimento, sexo, nomeDaRua, cep,
        numeroDaRua, complemento, bairro } = req.body;


    //Pegar slot de conexão na Pool
    db.getConnection((err, connection) => {
        if (err) throw err; // Se der erro, não conecta
        console.log('Conectado na Pool como: ' + connection.threadId);
        //Usar a conexão
        connection.query('UPDATE clientes SET nome = ?, rg = ?, cpf = ?, emailCliente = ?, telefone = ?, celular = ?, nascimento = ?, sexo = ?, nomeDaRua = ?, cep = ?, numeroDaRua = ?, complemento = ?, bairro = ? WHERE id = ?',
        [nome, rg, cpf, emailCliente, telefone, celular, nascimento, sexo, nomeDaRua, cep, numeroDaRua, complemento, bairro, req.params.id], (err, rows) => {
            //Quando finalizar a conexão...
            connection.release();
            if (!err) { // Se !NÃO houver erro...
                
            db.getConnection((err, connection) =>{
                if(err) throw err;
                console.log('Conectado na Pool como: ' + connection.threadId);

                connection.query('SELECT * FROM clientes WHERE id = ?', [req.params.id], (err, rows) =>{
                    connection.release();
                    if(!err) {
                        return res.render('editarCliente', {rows, message: 'As informações de ' + nome + ' foram atualizadas com sucesso!'});
                    } else {
                        console.log(err);
                    }
                });
            });

            } else {
                console.log(err);
            }
            console.log('Os dados da tabela de clientes são: \n', rows)
        });
    });
}



// Deletar Cliente
exports.delete = (req, res) => {
    //Pegar slot de conexão na Pool
    db.getConnection((err, connection) => {
        if (err) throw err; // Se der erro, não conecta
        console.log('Conectado na Pool como: ' + connection.threadId);
        //Usar a conexão
        connection.query('DELETE FROM clientes WHERE id = ?', [req.params.id], (err, rows) => {
            //Quando finalizar a conexão...
            connection.release();
            if (!err) { // Se !NÃO houver erro...
               res.redirect('/gerenciarClientes')
            } else {
                console.log(err);
            }
            console.log('Os dados da tabela de clientes são: \n', rows)
        });
    });
}