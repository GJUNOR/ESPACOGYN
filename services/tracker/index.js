// ==========================================
// ATLAS TRACKER
// ORQUESTRADOR PRINCIPAL
// ==========================================


const visitantesService =
require("../visitantes");


const visitasService =
require("../visitas");


const conversoesService =
require("../conversoes");


const eventosService =
require("../eventos");


const metaService =
require("../meta/conversions");



const {
    montarVisitante,
    montarVisita,
    montarConversao,
    montarEvento

} = require("../mappers");





// ==========================================
// PROCESSAR TRACKER COMPLETO
// ==========================================


async function registrar(req) {


    const visitaRecebida = req.body;



    console.log(
        "🚀 Iniciando processamento do tracker"
    );


    console.log(
        visitaRecebida
    );





    // ===============================
    // CRIA OU ATUALIZA VISITANTE
    // ===============================


    let visitante =
        await visitantesService.buscarVisitante(
            visitaRecebida.visitante_id
        );




    if(!visitante){


        const novoVisitante =
            montarVisitante(
                visitaRecebida,
                req
            );


        visitante =
            await visitantesService.criarVisitante(
                novoVisitante
            );


        console.log(
            "Novo visitante criado"
        );


    }else{


        visitante =
            await visitantesService.atualizarVisitante(
                visitante,
                visitaRecebida
            );


        console.log(
            "Visitante atualizado"
        );

    }





    // ===============================
    // SALVA VISITA
    // ===============================


    const novaVisita =
        montarVisita(
            visitaRecebida,
            req
        );



    const visitaCriada =
        await visitasService.salvarVisita(
            novaVisita
        );



    console.log(
        "Visita criada:",
        visitaCriada.id
    );







    // ===============================
    // CRIA CONVERSÃO WHATSAPP
    // ===============================


    const conversao =
    await conversoesService.registrarConversao({

        visitante_id:
        visitaRecebida.visitante_id,

        visita_id:
        visitaCriada.id,

        sessao_id:
        visitaRecebida.sessao_id,

        tipo:
        "whatsapp",

        valor:
        0,

        status:
        "novo",

        origem:
        visitaRecebida.utm_source || "direto",

        observacao:
        "Cliente enviado para WhatsApp",

        utm_source:
        visitaRecebida.utm_source,

        utm_medium:
        visitaRecebida.utm_medium,

        utm_campaign:
        visitaRecebida.utm_campaign

    });



    if(conversao.nova){

        console.log(
            "Conversão criada:",
            conversao.id
        );

    }else{

        console.log(
            "💬 Conversão já existente:",
            conversao.id
        );

    }







    // ===============================
    // CRIA EVENTO
    // ===============================


    const evento =
    montarEvento(
        visitaRecebida,
        conversao.id,
        visitaCriada.id
    );




    const resultadoEvento =
    await eventosService.criarEvento(
        evento
    );



    if(resultadoEvento.novo){

        console.log(
            "Evento criado:",
            resultadoEvento.id
        );

    }else{

        console.log(
            "📌 Evento já existente:",
            resultadoEvento.id
        );

    }







    // ===============================
    // ENVIA PARA META CAPI
    // ===============================


    try {


        const retornoMeta =
        await metaService.enviarEventoMeta({

            event_id:
            evento.event_id,


            fbp:
            visitaRecebida.fbp,


            fbc:
            visitaRecebida.fbc,


            user_agent:
            visitaRecebida.user_agent,


            url:
            visitaRecebida.url,


            ip:
            req.ip

        });



        console.log(
            "🚀 Meta respondeu:",
            retornoMeta
        );



        await eventosService.marcarComoEnviadoMeta(
            resultadoEvento.id
        );



        console.log(
            "✅ Evento marcado como enviado para Meta"
        );



    } catch(erro){


        console.error(
            "❌ Erro Meta CAPI:",
            erro.message
        );


    }







    return {


        visitante,


        visita:
        visitaCriada,


        conversao,


        evento:
        resultadoEvento,



        whatsapp:
        "https://wa.me/5562992301358?text=Olá,%20vim%20pelo%20anúncio."

    };


}





module.exports = {


    registrar


};