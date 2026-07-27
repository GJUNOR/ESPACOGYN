const tracker =
    require("../services/tracker");


const WHATSAPP_URL =
    "https://wa.me/5562992301358?text=Olá,%20vim%20pelo%20anúncio.";



// ==========================================
// REGISTRAR VISITA
// ==========================================

async function registrarVisita(req, res) {


    try {


        const resultado =
            await tracker.registrar(req);



        console.log(
            "✅ Tracker executado com sucesso"
        );



        return res.json({

            sucesso: true,

            whatsapp: WHATSAPP_URL,

            dados: resultado

        });



    } catch(err) {


        console.error(
            "❌ Erro no controller tracker:",
            err
        );



        return res.status(500).json({


            sucesso: false,


            erro: err.message


        });


    }


}



module.exports = {

    registrarVisita

};