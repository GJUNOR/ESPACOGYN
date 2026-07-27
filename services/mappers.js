// ==========================================
// MAPPERS DO ATLAS TRACKER
// Converte dados do frontend para o banco
// ==========================================



// ==========================================
// VISITANTE
// ==========================================

const crypto = require("crypto");

function montarVisitante(visita, req) {


    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.ip ||
        null;



    return {

        visitante_id:
            visita.visitante_id,


        nome:
            null,


        telefone:
            null,


        criado_em:
            new Date(),


        primeira_visita:
            new Date(),


        ultima_visita:
            new Date(),


        total_visitas:
            1,


        total_conversoes:
            0,


        status:
            "novo",



        // PRIMEIRA ATRIBUIÇÃO

        primeiro_fbclid:
            visita.fbclid || null,


        primeira_utm_source:
            visita.utm_source || null,


        primeira_utm_medium:
            visita.utm_medium || null,


        primeira_utm_campaign:
            visita.utm_campaign || null,


        primeira_utm_content:
            visita.utm_content || null,


        primeira_utm_term:
            visita.utm_term || null,



        primeiro_ip:
            ip,


        primeiro_user_agent:
            visita.user_agent || null,



        // ÚLTIMA ATRIBUIÇÃO
             ultima_utm_source:
            visita.utm_source || null,


        ultima_utm_medium:
            visita.utm_medium || null,


        ultima_utm_campaign:
            visita.utm_campaign || null,


        ultimo_navegador:
            null,


        ultimo_sistema:
            null,


        ultimo_dispositivo:
            null

    };

}





// ==========================================
// VISITA
// ==========================================

function montarVisita(visita, req) {


    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.ip ||
        null;



    return {


        visitante_id:
            visita.visitante_id,


        sessao_id:
            visita.sessao_id,


        fbclid:
            visita.fbclid || null,


        fbc:
            visita.fbc || null,


        fbp:
            visita.fbp || null,



        utm_source:
            visita.utm_source || null,


        utm_medium:
            visita.utm_medium || null,


        utm_campaign:
            visita.utm_campaign || null,


        utm_content:
            visita.utm_content || null,


        utm_term:
            visita.utm_term || null,



        url:
            visita.url || null,


        referrer:
            visita.referrer || null,


        idioma:
            visita.idioma || null,


        platform:
            visita.platform || null,


        screen_width:
            visita.screen_width || null,


        screen_height:
            visita.screen_height || null,


        pixel_ratio:
            visita.pixel_ratio || null,


        timezone:
            visita.timezone || null,



        timestamp_cliente:
            visita.timestamp_cliente || null,


        ip:
            ip,


        user_agent:
            visita.user_agent || null,


        status:
            "nova"


    };

}





// ==========================================
// CONVERSÃO
// ==========================================

function montarConversao(visita, visitaId) {


    return {


        visitante_id:
            visita.visitante_id,


        visita_id:
            visitaId,


        sessao_id:
            visita.sessao_id,


        tipo:
            "whatsapp",


        valor:
            0,


        status:
            "novo",


        origem:
            visita.utm_source || "direto",



        observacao:
            "Cliente enviado para WhatsApp",



        utm_source:
            visita.utm_source || null,


        utm_medium:
            visita.utm_medium || null,


        utm_campaign:
            visita.utm_campaign || null


    };

}





// ==========================================
// EVENTO
// ==========================================

function montarEvento(
    visita,
    conversaoId,
    visitaId
) {


    return {

        visitante_id:
            visita.visitante_id,


        visita_id:
            visitaId || null,


        tipo_evento:
            "whatsapp_click",


        status:
            "novo",


        criado_em:
            new Date(),


        enviado_meta:
            false,


        event_id:
            crypto.randomUUID(),


        sessao_id:
            visita.sessao_id,


        conversao_id:
            conversaoId

    };

}

module.exports = {


    montarVisitante,

    montarVisita,

    montarConversao,

    montarEvento


};