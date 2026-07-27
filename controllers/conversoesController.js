const conversoesService =
require("../services/conversoes");


async function listarConversoes(req,res){

    try{

        const dados =
        await conversoesService.buscarConversoes();


        res.json(dados);


    }catch(error){

        console.error(error);


        res.status(500).json({

            erro:"Erro buscando conversões"

        });

    }

}



async function criarConversao(req,res){

    try{


        const conversao =
        await conversoesService.criarConversao(
            req.body
        );


        res.json({

            sucesso:true,

            dados:conversao

        });


    }catch(error){


        console.error(error);


        res.status(500).json({

            erro:"Erro criando conversão"

        });

    }

}



module.exports = {

    listarConversoes,

    criarConversao

};