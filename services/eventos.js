const supabase = require("../config/supabase");



// ==========================================
// CRIAR EVENTO
// ==========================================

async function criarEvento(evento) {


    // Verifica se já existe este evento

    const { data: existente, error: erroBusca } =
    await supabase
        .from("eventos")
        .select("*")
        .eq(
            "conversao_id",
            evento.conversao_id
        )
        .eq(
            "tipo_evento",
            evento.tipo_evento
        )
        .limit(1)
        .maybeSingle();



    if (erroBusca) {

        throw erroBusca;

    }



    if (existente) {

        return {

            id: existente.id,

            novo: false,

            dados: existente

        };

    }





    const { data, error } =
        await supabase
            .from("eventos")
            .insert([
                evento
            ])
            .select()
            .single();



    if(error){

        console.error(
            "Erro criando evento:",
            error
        );

        throw error;

    }




    return {

        id: data.id,

        novo: true,

        dados: data

    };


}





// ==========================================
// LISTAR EVENTOS
// ==========================================

async function listarEventos(){


    const { data, error } =
        await supabase
            .from("eventos")
            .select("*")
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
// BUSCAR EVENTOS DO VISITANTE
// ==========================================

async function buscarEventosVisitante(
    visitanteId
){


    const { data, error } =
        await supabase
            .from("eventos")
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
// MARCAR EVENTO COMO ENVIADO PARA META
// ==========================================
async function marcarComoEnviadoMeta(eventoId) {

    const { data, error } = await supabase
        .from("eventos")
        .update({

            enviado_meta: true,

            data_envio_meta: new Date()

        })
        .eq(
            "id",
            eventoId
        )
        .select()
        .single();


    if(error){

        throw error;

    }


    return data;

}



module.exports = {

    criarEvento,

    listarEventos,

    buscarEventosVisitante,

    marcarComoEnviadoMeta

};