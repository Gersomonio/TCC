const mysql = require("mysql");

//Criando a conexão com o banco.
const db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//Transmitir os horários para a view
exports.view = (req, res) => {


    //Conectando ao banco
    db.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Conectado na Pool como: ' + connection.threadId)

        //Usando a conexão
        connection.query('SELECT id, nome, CONVERT(dataeHora, DATETIME) as dataeHora FROM agendamentos', (error, rows) => {
            //Quando finalizar a conexão...
            connection.release(); // Depois de feita a query, é liberado o slot na Pool.
            if (!err) { // Se não der erro
                res.render('tabelaHorarios', { rows }) //Renderizar a página e as rows da tabela.
            } else {
                console.log(error);
            }
            console.log('Os dados de agendamento são: \n', rows)
        })
    })
}

//Editar Agendamento
exports.edit = (req, res) => {
    //Pegar o slot de conexão na Pool
    db.getConnection((err, connection) => {
        if (err) throw err; // Se der erro, não conecta
        console.log('Conectado na Pool como' + connection.threadId);
        // Usar a conexão
        connection.query('SELECT * FROM agendamentos WHERE id = ?', [req.params.id], (err, rows) => {
            //Quando finalizar a conexão...
            connection.release();
            if (!err) { // Se !NÃO houver erro...
                return res.render('editarConsulta', { rows });

            } else {
                console.log(err);
            }
        })
    })
}

//Atualizar os Dados de Agendamento...
exports.update = (req, res) => {
    const { nome, datahora } = req.body;

    //Pegar slot de conexão na Pool
    db.getConnection((err, connection) => {
        if (err) throw err; // Se der errado, não conecta
        console.log('Conectado na Pool como:' + connection.threadId);
        //Usar a conexão
        connection.query('UPDATE agendamentos SET nome = ?, dataeHora = CONVERT(?, DATETIME) WHERE id = ?',
        [nome, new Date(datahora), req.params.id], (err, rows) =>{
            //Quando finalizar a conexão...
            connection.release();
            if(!err) { //Se !NÃO houver erro...

            db.getConnection((err, connection) =>{
                if(err) throw err;
                console.log('Conectado na Pool como: ' + connection.threadId);

                connection.query('SELECT * FROM agendamentos WHERE id = ?', [req.params.id], (err, rows) =>{
                    connection.release();
                    if(!err) {
                        return res.render('editarConsulta', {rows, message: 'O agendamento de ' + nome + ' foi alterado.'})
                    } else {
                        console.log(err);
                    }
                })
            })
            } else {
                console.log(err);
            }
            console.log('Os dados de agendamento são: \n', rows);
        })
    });
}


//Deletar Agendamento
exports.delete = (req, res) => {
    //Pegar o slot de conexão na Pool
    db.getConnection((err, connection) => {
        if (err) throw err; // Se der erro, não conecta
        console.log('Conectado na Pool como' + connection.threadId);
        // Usar a conexão
        connection.query('DELETE FROM agendamentos WHERE id = ?', [req.params.id], (err, rows) => {
            //Quando finalizar a conexão...
            connection.release();
            if (!err) { // Se !NÃO houver erro...
                res.redirect('/tabelaHorarios');
            } else {
                console.log(err);
            }
        })
    })
}

// Relacionado ao PDF

exports.pdf = (req, res) => {
    //Pegar o slot de conexão na Pool
    db.getConnection((err, connection) => {
        if (err) throw err; // Se der erro, não conecta
        console.log('Conectado na Pool como' + connection.threadId);
        // Usar a conexão
        connection.query('SELECT * FROM agendamentos WHERE id = ?', [req.params.id], (err, rows) => {
            //Quando finalizar a conexão...
            connection.release();
            if (!err) { // Se !NÃO houver erro...
                return res.render('pdfgen', { rows });
            } else {
                console.log(err);
            }
        })
    })
}