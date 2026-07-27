const eventosService = require("../eventos");

const {
    montarEvento
} = require("../mappers");


// ======================================
// PROCESSAR EVENTO
// ======================================

async function processar(
    visitante,
    conversao,
    nomeEvento,
    descricao = null
) {


    const eventoBanco =
        montarEvento(
            conversao.id,
            nomeEvento,
            descricao
        );


    eventoBanco.visitante_id =
        visitante.visitante_id;



    const evento =
        await eventosService.registrarEvento(
            eventoBanco
        );


    console.log(
        "📌 Evento registrado:",
        nomeEvento
    );


    return evento;

}


module.exports = {

    processar

};