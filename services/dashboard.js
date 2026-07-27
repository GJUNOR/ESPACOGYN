const supabase = require("../config/supabase");
const UAParser = require("ua-parser-js");

async function obterResumo() {
  const { count: totalVisitas } = await supabase
    .from("visitas")
    .select("*", { count: "exact", head: true });

  const { count: totalVisitantes } = await supabase
    .from("visitantes")
    .select("*", { count: "exact", head: true });

  const { count: totalConversoes } = await supabase
    .from("conversoes")
    .select("*", { count: "exact", head: true });

  return {
    visitas: totalVisitas || 0,
    visitantes: totalVisitantes || 0,
    conversoes: totalConversoes || 0,
  };
}

async function obterUltimasVisitas() {
  const { data, error } = await supabase
    .from("visitas")
    .select("*")
    .order("criado_em", { ascending: false })
    .limit(10);

  if (error) throw error;

  return data.map((visita) => {
    const parser = new UAParser(visita.user_agent);

    return {
      ...visita,
      navegador: parser.getBrowser().name || "Desconhecido",
      sistema: parser.getOS().name || "Desconhecido",
      dispositivo:
        parser.getDevice().type === undefined
          ? "Desktop"
          : parser.getDevice().type,
    };
  });
}

async function obterCampanhas() {
  const { data, error } = await supabase
    .from("visitas")
    .select("utm_campaign");

  if (error) throw error;

  const campanhas = {};

  data.forEach((item) => {
    const nome = item.utm_campaign || "Sem campanha";
    campanhas[nome] = (campanhas[nome] || 0) + 1;
  });

  return Object.entries(campanhas)
    .map(([campanha, quantidade]) => ({
      campanha,
      quantidade,
    }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

async function obterOrigens() {
  const { data, error } = await supabase
    .from("visitas")
    .select("utm_source");

  if (error) throw error;

  const origens = {};

  data.forEach((item) => {
    const origem = item.utm_source || "Direto";
    origens[origem] = (origens[origem] || 0) + 1;
  });

  return Object.entries(origens)
    .map(([origem, quantidade]) => ({
      origem,
      quantidade,
    }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

async function obterNavegadores() {
  const { data, error } = await supabase
    .from("visitas")
    .select("user_agent");

  if (error) throw error;

  const navegadores = {};

  data.forEach((item) => {
    const parser = new UAParser(item.user_agent);

    const navegador =
      parser.getBrowser().name || "Desconhecido";

    navegadores[navegador] =
      (navegadores[navegador] || 0) + 1;
  });

  return Object.entries(navegadores)
    .map(([navegador, quantidade]) => ({
      navegador,
      quantidade,
    }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

async function obterSistemas() {
  const { data, error } = await supabase
    .from("visitas")
    .select("user_agent");

  if (error) throw error;

  const sistemas = {};

  data.forEach((item) => {
    const parser = new UAParser(item.user_agent);

    const sistema =
      parser.getOS().name || "Desconhecido";

    sistemas[sistema] =
      (sistemas[sistema] || 0) + 1;
  });

  return Object.entries(sistemas)
    .map(([sistema, quantidade]) => ({
      sistema,
      quantidade,
    }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

async function obterDispositivos() {
  const { data, error } = await supabase
    .from("visitas")
    .select("user_agent");

  if (error) throw error;

  const dispositivos = {};

  data.forEach((item) => {
    const parser = new UAParser(item.user_agent);

    const dispositivo =
      parser.getDevice().type || "Desktop";

    dispositivos[dispositivo] =
      (dispositivos[dispositivo] || 0) + 1;
  });

  return Object.entries(dispositivos)
    .map(([dispositivo, quantidade]) => ({
      dispositivo,
      quantidade,
    }))
    .sort((a, b) => b.quantidade - a.quantidade);
}

module.exports = {
  obterResumo,
  obterUltimasVisitas,
  obterCampanhas,
  obterOrigens,
  obterNavegadores,
  obterSistemas,
  obterDispositivos,
};