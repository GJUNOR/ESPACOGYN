const visitasService = require("../visitas");

const {
    montarVisita
} = require("../mappers");


// ======================================
// PROCESSAR VISITA
// ======================================

async function processar(req, visitante) {


    const visita =
        req.body;



    // Monta objeto padrão da tabela visitas

    const visitaBanco =
        montarVisita(
            visita,
            req
        );



    // Relaciona visitante

    visitaBanco.visitante_id =
        visitante.visitante_id;



    // Salva visita

    const visitaSalva =
        await visitasService.salvarVisita(
            visitaBanco
        );



    console.log(
        "📄 Visita registrada"
    );



    return visitaSalva;


}



module.exports = {

    processar

};