const supabase = require("../config/supabase");


// ==========================================
// BUSCAR VISITANTE
// ==========================================

async function buscarVisitante(visitanteId) {


    const { data, error } = await supabase
        .from("visitantes")
        .select("*")
        .eq(
            "visitante_id",
            visitanteId
        )
        .maybeSingle();



    if(error){

        throw error;

    }


    return data;

}




// ==========================================
// CRIAR VISITANTE
// ==========================================

async function criarVisitante(visitante) {


    const { data, error } = await supabase
        .from("visitantes")
        .insert([
            visitante
        ])
        .select()
        .single();



    if(error){

        throw error;

    }


    return data;

}




// ==========================================
// ATUALIZAR VISITANTE DO TRACKER
// ==========================================

async function atualizarVisitante(
    visitanteAtual,
    visitanteNovo
) {


    const atualizacao = {


        ultima_visita:
            new Date(),


        total_visitas:
            (visitanteAtual.total_visitas || 0) + 1,


        ultima_utm_source:
            visitanteNovo.utm_source || null,


        ultima_utm_medium:
            visitanteNovo.utm_medium || null,


        ultima_utm_campaign:
            visitanteNovo.utm_campaign || null,


        ultimo_navegador:
            visitanteNovo.user_agent || null,


        ultimo_dispositivo:
            null,


        ultimo_sistema:
            null

    };



    const { data, error } = await supabase
        .from("visitantes")
        .update(atualizacao)
        .eq(
            "visitante_id",
            visitanteAtual.visitante_id
        )
        .select()
        .single();



    if(error){

        throw error;

    }


    return data;

}



// ==========================================
// ATUALIZAR DADOS DO LEAD PELO CRM
// ==========================================

async function atualizarLead(
    visitanteId,
    dados
) {


    const atualizacao = {};



    if(dados.nome !== undefined){

        atualizacao.nome =
            dados.nome;

    }



    if(dados.telefone !== undefined){

        atualizacao.telefone =
            dados.telefone;

    }



    if(dados.status !== undefined){

        atualizacao.status =
            dados.status;

    }



    const { data, error } = await supabase
        .from("visitantes")
        .update(atualizacao)
        .eq(
            "visitante_id",
            visitanteId
        )
        .select()
        .single();



    if(error){

        throw error;

    }


    return data;

}




// ==========================================
// LISTAR
// ==========================================

async function buscarTodosVisitantes() {


    const { data, error } = await supabase
        .from("visitantes")
        .select("*")
        .order(
            "ultima_visita",
            {
                ascending:false
            }
        );



    if(error){

        throw error;

    }


    return data;

}



async function buscarVisitantesPorStatus(status) {


    const { data, error } = await supabase
        .from("visitantes")
        .select("*")
        .eq(
            "status",
            status
        )
        .order(
            "ultima_visita",
            {
                ascending:false
            }
        );



    if(error){

        throw error;

    }


    return data;

}



module.exports = {

    buscarVisitante,

    criarVisitante,

    atualizarVisitante,

    atualizarLead,

    buscarTodosVisitantes,

    buscarVisitantesPorStatus

};