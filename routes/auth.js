const express = require('express');
const authController = require('../controllers/auth');
const clientesController = require('../controllers/clientesController')
const horariosController = require('../controllers/horariosController')

const router = express.Router();
             //O caminho é lido pelo NODE como auth/register!
router.post('/register', authController.register) //Essa rota só poderá ser acessada via método POST!

router.post('/login', authController.login) //Pega a função de login do index

router.post('/cadastroCliente', authController.cadastroCliente)

router.post('/agendarConsulta', authController.agendarConsulta)

module.exports = router; // Aqui exportamos como um módulo router. (linha 4)