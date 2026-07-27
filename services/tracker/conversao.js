const conversoesService = require("../conversoes");

const {
    montarConversao
} = require("../mappers");


// ======================================
// PROCESSAR CONVERSÃO
// ======================================

async function processar(
    req,
    visitante,
    visita
) {


    const conversaoBanco =
        montarConversao(
            req.body,
            visita.id
        );



    // Vincula visitante

    conversaoBanco.visitante_id =
        visitante.visitante_id;



    // Registra conversão

    const conversao =
        await conversoesService.registrarConversao(
            conversaoBanco
        );



    console.log(
        "💬 Conversão registrada"
    );



    return conversao;


}



module.exports = {

    processar

};