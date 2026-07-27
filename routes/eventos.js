const express = require("express");

const router = express.Router();

const eventosController =
    require("../controllers/eventosController");


// Criar evento

router.post(
    "/",
    eventosController.criarEvento
);


// Listar eventos

router.get(
    "/",
    eventosController.listarEventos
);


module.exports = router;