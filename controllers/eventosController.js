const eventosService =
    require("../services/eventos");



// ======================================
// CRIAR EVENTO
// ======================================

async function criarEvento(req, res) {

    try {


        const evento =
            await eventosService.registrarEvento(
                req.body
            );


        return res.json({

            sucesso: true,

            dados: evento

        });



    } catch (err) {


        console.error(
            "Erro criando evento:",
            err
        );


        return res.status(500).json({

            sucesso: false,

            erro: err.message

        });


    }

}




// ======================================
// LISTAR EVENTOS
// ======================================

async function listarEventos(req, res) {

    try {


        const eventos =
            await eventosService.listarEventos();


        return res.json({

            sucesso: true,

            dados: eventos

        });



    } catch (err) {


        console.error(
            "Erro listando eventos:",
            err
        );


        return res.status(500).json({

            sucesso: false,

            erro: err.message

        });


    }

}




module.exports = {

    criarEvento,

    listarEventos

};