const express = require("express");

const router = express.Router();

const conversoesController =
require("../controllers/conversoesController");

const conversoesService =
require("../services/conversoes");





// Criar conversão manual

router.post(
"/",
conversoesController.criarConversao
);





// Buscar conversões

router.get(
"/",
async(req,res)=>{


    try{


        const dados =
        await conversoesService.buscarConversoes();


        res.json(dados);



    }catch(error){


        console.error(error);


        res.status(500).json({

            erro:
            error.message

        });


    }


});








// Atualizar status do lead

router.put(
"/status",
async(req,res)=>{


    try{


        const {

            conversao_id,

            status

        } = req.body;





        const resultado =
        await conversoesService.atualizarStatusPorId(

            conversao_id,

            status

        );





        res.json(resultado);




    }catch(error){



        console.error(
            "Erro atualizando status:",
            error
        );



        res.status(500).json({

            erro:
            error.message

        });



    }


});






module.exports = router;