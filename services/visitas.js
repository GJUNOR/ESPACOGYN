const supabase = require("../config/supabase");



// ==========================================
// SALVAR VISITA
// ==========================================

async function salvarVisita(visita) {


    const { data, error } = await supabase
        .from("visitas")
        .insert([
            visita
        ])
        .select()
        .single();



    if(error){

        console.error(
            "Erro salvando visita:",
            error
        );

        throw error;

    }


    return data;

}




// ==========================================
// BUSCAR VISITA POR ID
// ==========================================

async function buscarVisita(id) {


    const { data, error } = await supabase
        .from("visitas")
        .select("*")
        .eq(
            "id",
            id
        )
        .maybeSingle();



    if(error){

        throw error;

    }


    return data;

}




// ==========================================
// BUSCAR VISITAS DO VISITANTE
// ==========================================

async function buscarVisitasVisitante(
    visitanteId
) {


    const { data, error } = await supabase
        .from("visitas")
        .select("*")
        .eq(
            "visitante_id",
            visitanteId
        )
        .order(
            "criado_em",
            {
                ascending:false
            }
        );



    if(error){

        throw error;

    }


    return data;

}




// ==========================================
// BUSCAR VISITAS POR SESSÃO
// ==========================================

async function buscarVisitasSessao(
    sessaoId
) {


    const { data, error } = await supabase
        .from("visitas")
        .select("*")
        .eq(
            "sessao_id",
            sessaoId
        )
        .order(
            "criado_em",
            {
                ascending:false
            }
        );



    if(error){

        throw error;

    }


    return data;

}




// ==========================================
// LISTAR VISITAS
// ==========================================

async function listarVisitas(
    limite = 100
) {


    const { data, error } = await supabase
        .from("visitas")
        .select("*")
        .order(
            "criado_em",
            {
                ascending:false
            }
        )
        .limit(limite);



    if(error){

        throw error;

    }


    return data;

}




module.exports = {


    salvarVisita,

    buscarVisita,

    buscarVisitasVisitante,

    buscarVisitasSessao,

    listarVisitas


};