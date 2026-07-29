const visitantesService =
require("../services/visitantes");


// ==========================================
// LISTAR VISITANTES
// ==========================================

async function listarVisitantes(req, res) {

    try {

        const dados =
            await visitantesService
                .buscarTodosVisitantes();

        return res.status(200).json(
            dados
        );

    } catch (error) {

        console.error(
            "Erro listando visitantes:",
            error
        );

        return res.status(500).json({

            sucesso: false,

            erro:
                error.message ||
                "Erro ao listar visitantes"

        });

    }

}


// ==========================================
// ATUALIZAR PACIENTE PELO CRM
// ==========================================

async function atualizarVisitante(req, res) {

    try {

        const visitanteId =
            req.params.id;

        const dadosAtualizacao = {

            nome:
                req.body.nome,

            telefone:
                req.body.telefone,

            status:
                req.body.status ||
                req.body.status_financeiro

        };

        const resultado =
            await visitantesService.atualizarLead(
                visitanteId,
                dadosAtualizacao
            );

        return res.status(200).json({

            sucesso: true,

            dados: resultado

        });

    } catch (error) {

        console.error(
            "Erro atualizando visitante:",
            error
        );

        return res.status(500).json({

            sucesso: false,

            erro:
                error.message ||
                "Erro ao atualizar visitante"

        });

    }

}


module.exports = {

    listarVisitantes,

    atualizarVisitante

};