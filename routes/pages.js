const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController')
const horariosController = require('../controllers/horariosController')

router.get('/', (req, res) => { //Nesse arquivo estamos transferindo as rotas de app.js para cá, para que o arquivo fique mais legível
    res.render('index');
});

router.get('/register', (req, res) => { //Request é quando você quer pegar algo de um FORM, Response é o que você quer enviar ao front-end
    res.render('register'); // // Se o APP pegar a rota /register, ele vai RENDERizar register(.hbs)
});

router.get('/home', (req, res) => {
    res.render('home');
});

router.get('/cadastroCliente', (req, res) => {
    res.render('cadastroCliente');
});

router.get('/agendarConsulta', (req, res) => {
    res.render('agendarConsulta');
});

router.get('/gerenciarClientes', clientesController.view);

router.get('/tabelaHorarios', horariosController.view)

router.get('/tabelaDiagnosticos', (req, res) => {
    res.render('tabelaDiagnosticos');
});
//Rota PDFs
router.get('/pdfgen/:id', horariosController.pdf) // Aqui eu optei por não criar um controller para os PDFs e simplesmente aproveitar os dados do controller de Horários.

//Rotas de Edição 
router.get('/editarCliente/:id', clientesController.edit)
router.post('/editarCliente/:id', clientesController.update)

router.get('/editarConsulta/:id', horariosController.edit)
router.post('/editarConsulta/:id', horariosController.update)

//Rotas de Delete
router.get('/:id', clientesController.delete)

router.get('/delete/:id', horariosController.delete)

module.exports = router; // Aqui exportamos como um módulo router. (linha 3)