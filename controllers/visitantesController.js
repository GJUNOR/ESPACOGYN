const visitantesService =
require("../services/visitantes");





// ===============================
// LISTAR VISITANTES
// ===============================


async function listarVisitantes(req,res){


    try{


        const dados =
        await visitantesService.listarVisitantes();


        res.json(dados);



    }catch(error){


        console.error(
            "Erro listando visitantes:",
            error
        );


        res.status(500).json({

            erro:
            error.message

        });


    }


}








// ===============================
// ATUALIZAR PACIENTE
// ===============================


async function atualizarVisitante(req,res){


    try{


        const id =
        req.params.id;



        const {

            nome,

            telefone

        } = req.body;





        const resultado =
        await visitantesService.atualizarVisitante(

            id,

            {

                nome,

                telefone

            }

        );





        res.json({

            sucesso:true,

            dados:
            resultado

        });





    }catch(error){


        console.error(
            "Erro atualizando visitante:",
            error
        );


        res.status(500).json({

            sucesso:false,

            erro:
            error.message

        });


    }


}







module.exports = {


    listarVisitantes,

    atualizarVisitante


};