const dashboardService = require("../services/dashboard");

async function dashboard(req, res) {
  try {

    const resumo = await dashboardService.obterResumo();

    const ultimasVisitas =
      await dashboardService.obterUltimasVisitas();

    const campanhas =
      await dashboardService.obterCampanhas();

    const origens =
      await dashboardService.obterOrigens();

    const navegadores =
      await dashboardService.obterNavegadores();

    const sistemas =
      await dashboardService.obterSistemas();

    const dispositivos =
      await dashboardService.obterDispositivos();

    res.json({

      ...resumo,

      ultimasVisitas,

      campanhas,

      origens,

      navegadores,

      sistemas,

      dispositivos

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "Erro ao carregar dashboard"
    });

  }
}

module.exports = {
  dashboard,
};