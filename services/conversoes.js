const supabase = require("../config/supabase");



// ==========================================
// REGISTRAR CONVERSÃO
// ==========================================

async function registrarConversao(conversao) {


    // Verifica se já existe conversão desta sessão

    const { data: existente, error: erroBusca } =
        await supabase
            .from("conversoes")
            .select("*")
            .eq(
                "sessao_id",
                conversao.sessao_id
            )
            .eq(
                "tipo",
                conversao.tipo
            )
            .maybeSingle();



    if (erroBusca) {

        throw erroBusca;

    }



    if (existente) {

        return {

            id: existente.id,

            nova: false,

            dados: existente

        };

    }





    const { data, error } =
        await supabase
            .from("conversoes")
            .insert([
                conversao
            ])
            .select()
            .single();




    if(error){

        console.error(
            "Erro criando conversão:",
            error
        );

        throw error;

    }





    return {

        id: data.id,

        nova: true,

        dados: data

    };


}





// ==========================================
// LISTAR CONVERSÕES
// ==========================================

async function listarConversoes(){


    const { data, error } =
        await supabase
            .from("conversoes")
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





module.exports = {


    registrarConversao,

    listarConversoes


};