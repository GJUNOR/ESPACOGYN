const express = require("express");
const path = require("path");

const router = express.Router();

const visitantesController =
    require("../controllers/visitantesController");


// ==========================================
// PÁGINA PRINCIPAL DAS SECRETÁRIAS
// ==========================================

router.get("/leads", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../public/leads.html"
        )
    );

});


// Também permite acessar por /pacientes

router.get("/pacientes", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../public/leads.html"
        )
    );

});


// ==========================================
// API — LISTAR PACIENTES
// ==========================================

router.get(
    "/api/leads",
    visitantesController.listarVisitantes
);


// ==========================================
// API — ATUALIZAR PACIENTE
// ==========================================

router.put(
    "/api/leads/:id",
    visitantesController.atualizarVisitante
);


module.exports = router;