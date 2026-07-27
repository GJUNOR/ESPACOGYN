const visitantesService = require("../visitantes");

const {
    montarVisitante
} = require("../mappers");


// ======================================
// PROCESSAR VISITANTE
// ======================================

async function processar(req) {


    const visita = req.body;


    // Monta objeto padrão do banco

    const visitanteBanco =
        montarVisitante(
            visita,
            req
        );



    // Procura visitante existente

    const visitanteExistente =
        await visitantesService.buscarVisitante(
            visita.visitante_id
        );



    // ===============================
    // NOVO VISITANTE
    // ===============================

    if (!visitanteExistente) {


        const novoVisitante =
            await visitantesService.criarVisitante(
                visitanteBanco
            );


        console.log(
            "🆕 Novo visitante criado"
        );


        return novoVisitante;


    }



    // ===============================
    // VISITANTE EXISTENTE
    // ===============================


    const visitanteAtualizado =
        await visitantesService.atualizarVisitante(
            visitanteExistente,
            visitanteBanco
        );


    console.log(
        "♻️ Visitante atualizado"
    );


    return visitanteAtualizado;


}



module.exports = {

    processar

};