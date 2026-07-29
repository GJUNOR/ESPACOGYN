"use strict";

// ======================================================
// ATLAS TRACKER
// CENTRAL DE PACIENTES
// LEADS.JS V4
// ======================================================

// URL relativa: funciona no localhost e na Vercel.
const API = "";


// ======================================================
// ELEMENTOS PRINCIPAIS
// ======================================================

const tabela =
    document.getElementById("tabelaPacientes");

const contadorPacientes =
    document.getElementById("contadorPacientes");

const pesquisa =
    document.getElementById("pesquisa");

const filtrosStatus =
    document.getElementById("filtrosStatus");


// ======================================================
// CARDS PRINCIPAIS
// ======================================================

const novosHoje =
    document.getElementById("novosHoje");

const emAtendimento =
    document.getElementById("emAtendimento");

const agendados =
    document.getElementById("agendados");

const convertidos =
    document.getElementById("convertidos");


// ======================================================
// RESUMO OPERACIONAL
// ======================================================

const aguardandoRetorno =
    document.getElementById("aguardandoRetorno");

const contatoHoje =
    document.getElementById("contatoHoje");

const avaliacoesHoje =
    document.getElementById("avaliacoesHoje");

const receitaHoje =
    document.getElementById("receitaHoje");


// ======================================================
// BOTÕES
// ======================================================

const btnAtualizar =
    document.getElementById("btnAtualizar");

const btnExportar =
    document.getElementById("btnExportar");

const btnNovoPaciente =
    document.getElementById("btnNovoPaciente");

const btnSalvarDrawer =
    document.getElementById("btnSalvarDrawer");


// ======================================================
// DRAWER
// ======================================================

const patientDrawer =
    document.getElementById("patientDrawer");

const drawerNome =
    document.getElementById("drawerNome");

const drawerLead =
    document.getElementById("drawerCodigoLead");

const drawerTelefone =
    document.getElementById("drawerTelefone");

const drawerCadastro =
    document.getElementById("drawerCadastro");

const drawerOrigem =
    document.getElementById("drawerOrigem");

const drawerStatus =
    document.getElementById("drawerStatus");


// ======================================================
// DRAWER — MARKETING
// ======================================================

const drawerCampanha =
    document.getElementById("drawerCampanha");

const drawerConjunto =
    document.getElementById("drawerConjunto");

const drawerAnuncio =
    document.getElementById("drawerAnuncio");

const drawerOrigemMarketing =
    document.getElementById("drawerOrigemMarketing");


// ======================================================
// DRAWER — RESULTADO
// ======================================================

const valorConversao =
    document.getElementById("valorConversao");

const statusFinanceiro =
    document.getElementById("statusFinanceiro");

const observacoes =
    document.getElementById("observacoes");


// ======================================================
// DRAWER — DADOS TÉCNICOS
// ======================================================

const campoUtmSource =
    document.getElementById("utm_source");

const campoUtmMedium =
    document.getElementById("utm_medium");

const campoUtmCampaign =
    document.getElementById("utm_campaign");

const campoUtmContent =
    document.getElementById("utm_content");

const campoUtmTerm =
    document.getElementById("utm_term");

const campoFbclid =
    document.getElementById("fbclid");

const campoFbp =
    document.getElementById("fbp");

const campoFbc =
    document.getElementById("fbc");

const campoIp =
    document.getElementById("ip");

const campoUserAgent =
    document.getElementById("useragent");

const campoLandingPage =
    document.getElementById("landing_page");

const campoReferer =
    document.getElementById("referer");

const campoDevice =
    document.getElementById("device");


// ======================================================
// ESTADO DA PÁGINA
// ======================================================

let pacientes = [];

let listaExibida = [];

let pacienteAtual = null;

let filtroAtual = "todos";

let carregando = false;


// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    configurarEventos();

    carregarPacientes();

});


// ======================================================
// EVENTOS
// ======================================================

function configurarEventos() {

    btnAtualizar?.addEventListener(
        "click",
        carregarPacientes
    );

    btnExportar?.addEventListener(
        "click",
        exportarCSV
    );

    btnNovoPaciente?.addEventListener(
        "click",
        abrirCadastroNovoPaciente
    );

    btnSalvarDrawer?.addEventListener(
        "click",
        salvarPaciente
    );

    pesquisa?.addEventListener(
        "input",
        aplicarFiltros
    );

    filtrosStatus?.addEventListener(
        "click",
        tratarCliqueFiltro
    );

    tabela?.addEventListener(
        "click",
        tratarAcaoTabela
    );

    document.addEventListener(
        "keydown",
        tratarAtalhos
    );

}


// ======================================================
// CARREGAR PACIENTES
// ======================================================

async function carregarPacientes() {

    if (carregando) return;

    carregando = true;

    mostrarCarregamento();

    atualizarEstadoBotao(true);

    try {

const resposta = await fetch("/api/visitantes", {
    method: "GET",
    headers: {
        Accept: "application/json"
    }
});

const texto = await resposta.text();

console.log("URL chamada:", resposta.url);
console.log("Status:", resposta.status);
console.log("Resposta recebida:", texto);

if (!resposta.ok) {
    throw new Error(`Erro ${resposta.status}: ${texto}`);
}

let resultado;

try {
    resultado = JSON.parse(texto);
} catch {
    throw new Error(
        "A rota /visitantes devolveu HTML em vez de JSON."
    );
}

        if (!resposta.ok) {

            const mensagem =
                await obterMensagemErro(resposta);

            throw new Error(
                mensagem || "Erro ao carregar pacientes."
            );

        }

        const resultado =
    await resposta.json();

console.log(
    "Resposta da API /visitantes:",
    resultado
);

pacientes =
    Array.isArray(resultado)
        ? resultado
        : Array.isArray(resultado.dados)
            ? resultado.dados
            : Array.isArray(resultado.pacientes)
                ? resultado.pacientes
                : [];

console.log(
    "Pacientes carregados:",
    pacientes
);

        atualizarIndicadores();

        aplicarFiltros();

    } catch (erro) {

        console.error(
            "Erro carregando pacientes:",
            erro
        );

        mostrarErroTabela(
            erro.message ||
            "Não foi possível carregar os pacientes."
        );

        notificar(
            "Erro",
            "Não foi possível carregar os pacientes.",
            "error"
        );

    } finally {

        carregando = false;

        atualizarEstadoBotao(false);

    }

}


// ======================================================
// FILTROS
// ======================================================

function tratarCliqueFiltro(evento) {

    const botao =
        evento.target.closest(".filter-chip");

    if (!botao) return;

    document
        .querySelectorAll(".filter-chip")
        .forEach((item) => {

            item.classList.remove("active");

        });

    botao.classList.add("active");

    filtroAtual =
        botao.dataset.status || "todos";

    aplicarFiltros();

}


function aplicarFiltros() {

    const termo =
        normalizarTexto(
            pesquisa?.value || ""
        );

    listaExibida =
        pacientes.filter((paciente) => {

            const correspondePesquisa =
                pacienteCorrespondePesquisa(
                    paciente,
                    termo
                );

            const correspondeStatus =
                pacienteCorrespondeStatus(
                    paciente,
                    filtroAtual
                );

            return (
                correspondePesquisa &&
                correspondeStatus
            );

        });

    renderizarTabela(listaExibida);

}


function pacienteCorrespondePesquisa(
    paciente,
    termo
) {

    if (!termo) return true;

    const campos = [

        paciente.nome,

        paciente.telefone,

        paciente.whatsapp,

        paciente.utm_source,

        paciente.origem,

        paciente.utm_campaign,

        paciente.adset_name,

        paciente.ad_name,

        paciente.visitante_id,

        paciente.id

    ];

    return campos.some((campo) => {

        return normalizarTexto(campo)
            .includes(termo);

    });

}


function pacienteCorrespondeStatus(
    paciente,
    filtro
) {

    if (
        !filtro ||
        filtro === "todos"
    ) {

        return true;

    }

    return obterStatusNormalizado(paciente) === filtro;

}


// ======================================================
// INDICADORES
// ======================================================

function atualizarIndicadores() {

    const hoje =
        obterInicioDoDia();

    let totalNovosHoje = 0;

    let totalAtendimento = 0;

    let totalAgendados = 0;

    let totalConvertidos = 0;

    let totalAguardando = 0;

    let totalContatosHoje = 0;

    let totalAvaliacoesHoje = 0;

    let totalReceitaHoje = 0;

    pacientes.forEach((paciente) => {

        const status =
            obterStatusNormalizado(paciente);

        const dataCadastro =
            obterDataCadastro(paciente);

        const dataAtualizacao =
            obterDataAtualizacao(paciente);

        const dataAgendamento =
            obterDataAgendamento(paciente);

        const criadoHoje =
            dataCadastro &&
            dataCadastro >= hoje;

        const atualizadoHoje =
            dataAtualizacao &&
            dataAtualizacao >= hoje;

        const agendadoHoje =
            dataAgendamento &&
            dataAgendamento >= hoje &&
            dataAgendamento < adicionarDias(
                hoje,
                1
            );

        if (
            status === "novo" &&
            criadoHoje
        ) {

            totalNovosHoje++;

        }

        if (status === "atendimento") {

            totalAtendimento++;

        }

        if (status === "agendado") {

            totalAgendados++;

        }

        if (status === "convertido") {

            totalConvertidos++;

        }

        if (status === "novo") {

            totalAguardando++;

        }

        if (
            atualizadoHoje &&
            status !== "novo"
        ) {

            totalContatosHoje++;

        }

        if (
            agendadoHoje ||
            (
                status === "agendado" &&
                criadoHoje
            )
        ) {

            totalAvaliacoesHoje++;

        }

        if (
            status === "convertido" &&
            (
                atualizadoHoje ||
                criadoHoje
            )
        ) {

            totalReceitaHoje +=
                obterValorConversao(paciente);

        }

    });

    definirTexto(
        novosHoje,
        totalNovosHoje
    );

    definirTexto(
        emAtendimento,
        totalAtendimento
    );

    definirTexto(
        agendados,
        totalAgendados
    );

    definirTexto(
        convertidos,
        totalConvertidos
    );

    definirTexto(
        aguardandoRetorno,
        totalAguardando
    );

    definirTexto(
        contatoHoje,
        totalContatosHoje
    );

    definirTexto(
        avaliacoesHoje,
        totalAvaliacoesHoje
    );

    definirTexto(
        receitaHoje,
        formatarMoeda(totalReceitaHoje)
    );

}


// ======================================================
// RENDERIZAR TABELA
// ======================================================

function renderizarTabela(lista) {

    if (!tabela) return;

    definirTexto(
        contadorPacientes,
        `${lista.length} ${
            lista.length === 1
                ? "registro encontrado"
                : "registros encontrados"
        }`
    );

    if (lista.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-state"
                >

                    <i class="fa-solid fa-users-slash"></i>

                    <strong>
                        Nenhum paciente encontrado
                    </strong>

                    <p>
                        Tente alterar a busca ou o filtro selecionado.
                    </p>

                </td>

            </tr>

        `;

        return;

    }

    tabela.innerHTML =
        lista.map((paciente) => {

            return criarLinhaPaciente(paciente);

        }).join("");

}


function criarLinhaPaciente(paciente) {

    const id =
        obterIdPaciente(paciente);

    const nome =
        paciente.nome || "Paciente sem nome";

    const telefone =
        obterTelefone(paciente);

    const origem =
        obterOrigem(paciente);

    const campanha =
        paciente.utm_campaign ||
        paciente.primeira_utm_campaign ||
        paciente.ultima_utm_campaign ||
        "Sem campanha";

    const ultimaInteracao =
        obterDataAtualizacao(paciente) ||
        obterDataCadastro(paciente);

    const status =
        obterStatusNormalizado(paciente);

    const statusTexto =
        obterNomeStatus(status);

    const iniciais =
        obterIniciais(nome);

    const classeOrigem =
        obterClasseOrigem(origem);

    const telefoneLimpo =
        limparTelefone(telefone);

    return `

        <tr>

            <td>

                <div class="patient-identification">

                    <div class="patient-avatar">
                        ${escapeHtml(iniciais)}
                    </div>

                    <div>

                        <div class="patient-name">
                            ${escapeHtml(nome)}
                        </div>

                        <span class="patient-code">
                            ${
                                id
                                    ? `Paciente ${escapeHtml(String(id))}`
                                    : "Cadastro sem identificação"
                            }
                        </span>

                    </div>

                </div>

            </td>

            <td>

                <span class="contact-value">
                    ${escapeHtml(formatarTelefone(telefone))}
                </span>

                <span class="contact-secondary">
                    WhatsApp
                </span>

            </td>

            <td>

                <span class="source-label">

                    <span
                        class="source-dot ${classeOrigem}"
                    ></span>

                    ${escapeHtml(origem)}

                </span>

                <span class="contact-secondary">
                    ${escapeHtml(campanha)}
                </span>

            </td>

            <td>

                <span class="contact-value">
                    ${formatarTempoRelativo(ultimaInteracao)}
                </span>

                <span class="contact-secondary">
                    ${formatarDataHora(ultimaInteracao)}
                </span>

            </td>

            <td>

                <span
                    class="patient-status status-${status}"
                >

                    ${escapeHtml(statusTexto)}

                </span>

            </td>

            <td>

                <div class="patient-actions">

                    <button
                        type="button"
                        class="action-button whatsapp"
                        data-action="whatsapp"
                        data-id="${escapeHtml(String(id || ""))}"
                        title="Abrir WhatsApp"
                        ${
                            telefoneLimpo
                                ? ""
                                : "disabled"
                        }
                    >

                        <i class="fa-brands fa-whatsapp"></i>

                    </button>

                    <button
                        type="button"
                        class="action-button view"
                        data-action="visualizar"
                        data-id="${escapeHtml(String(id || ""))}"
                        title="Visualizar paciente"
                    >

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                        type="button"
                        class="action-button edit"
                        data-action="editar"
                        data-id="${escapeHtml(String(id || ""))}"
                        title="Editar paciente"
                    >

                        <i class="fa-solid fa-pen"></i>

                    </button>

                </div>

            </td>

        </tr>

    `;

}


// ======================================================
// AÇÕES DA TABELA
// ======================================================

function tratarAcaoTabela(evento) {

    const botao =
        evento.target.closest("[data-action]");

    if (!botao) return;

    const id =
        botao.dataset.id;

    const acao =
        botao.dataset.action;

    const paciente =
        localizarPaciente(id);

    if (!paciente) {

        notificar(
            "Paciente não encontrado",
            "Atualize a lista e tente novamente.",
            "warning"
        );

        return;

    }

    if (acao === "whatsapp") {

        abrirWhatsApp(paciente);

        return;

    }

    if (
        acao === "visualizar" ||
        acao === "editar"
    ) {

        abrirPaciente(paciente);

    }

}


// ======================================================
// WHATSAPP
// ======================================================

function abrirWhatsApp(paciente) {

    const telefone =
        limparTelefone(
            obterTelefone(paciente)
        );

    if (!telefone) {

        notificar(
            "Telefone ausente",
            "Esse paciente ainda não possui telefone cadastrado.",
            "warning"
        );

        return;

    }

    let numero = telefone;

    if (
        numero.length >= 10 &&
        numero.length <= 11
    ) {

        numero = `55${numero}`;

    }

    const nome =
        paciente.nome || "";

    const mensagem =
        nome
            ? `Olá, ${nome}! Tudo bem? Aqui é da Espaço da Coluna.`
            : "Olá! Tudo bem? Aqui é da Espaço da Coluna.";

    const url =
        `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );

}


// ======================================================
// ABRIR DRAWER
// ======================================================

function abrirPaciente(pacienteOuIndice) {

    let paciente = pacienteOuIndice;

    if (
        typeof pacienteOuIndice === "number"
    ) {

        paciente =
            pacientes[pacienteOuIndice];

    }

    if (!paciente) return;

    pacienteAtual = paciente;

    const id =
        obterIdPaciente(paciente);

    definirTexto(
        drawerNome,
        paciente.nome || "Paciente sem nome"
    );

    definirTexto(
        drawerLead,
        id
            ? `Paciente ${id}`
            : "Paciente sem código"
    );

    definirTexto(
        drawerTelefone,
        formatarTelefone(
            obterTelefone(paciente)
        )
    );

    definirTexto(
        drawerCadastro,
        formatarDataHora(
            obterDataCadastro(paciente)
        )
    );

    definirTexto(
        drawerOrigem,
        obterOrigem(paciente)
    );

    definirTexto(
        drawerStatus,
        obterNomeStatus(
            obterStatusNormalizado(paciente)
        )
    );

    definirTexto(
        drawerCampanha,
        paciente.utm_campaign ||
        paciente.primeira_utm_campaign ||
        paciente.ultima_utm_campaign ||
        "-"
    );

    definirTexto(
        drawerConjunto,
        paciente.adset_name ||
        paciente.conjunto ||
        paciente.utm_content ||
        "-"
    );

    definirTexto(
        drawerAnuncio,
        paciente.ad_name ||
        paciente.anuncio ||
        paciente.utm_term ||
        "-"
    );

    definirTexto(
        drawerOrigemMarketing,
        paciente.utm_source ||
        paciente.primeira_utm_source ||
        paciente.ultima_utm_source ||
        "-"
    );

    if (valorConversao) {

        valorConversao.value =
            obterValorConversao(paciente) || "";

    }

    if (statusFinanceiro) {

        statusFinanceiro.value =
            paciente.status_financeiro ||
            paciente.status ||
            "novo";

    }

    if (observacoes) {

        observacoes.value =
            paciente.observacoes ||
            paciente.observacao ||
            "";

    }

    preencherDadosTecnicos(paciente);

    abrirDrawerSeguro();

}


// ======================================================
// DADOS TÉCNICOS
// ======================================================

function preencherDadosTecnicos(paciente) {

    definirTexto(
        campoUtmSource,
        paciente.utm_source ||
        paciente.primeira_utm_source ||
        paciente.ultima_utm_source ||
        "-"
    );

    definirTexto(
        campoUtmMedium,
        paciente.utm_medium ||
        paciente.primeira_utm_medium ||
        paciente.ultima_utm_medium ||
        "-"
    );

    definirTexto(
        campoUtmCampaign,
        paciente.utm_campaign ||
        paciente.primeira_utm_campaign ||
        paciente.ultima_utm_campaign ||
        "-"
    );

    definirTexto(
        campoUtmContent,
        paciente.utm_content ||
        paciente.primeira_utm_content ||
        paciente.ultima_utm_content ||
        "-"
    );

    definirTexto(
        campoUtmTerm,
        paciente.utm_term ||
        paciente.primeira_utm_term ||
        paciente.ultima_utm_term ||
        "-"
    );

    definirTexto(
        campoFbclid,
        paciente.fbclid ||
        paciente.primeiro_fbclid ||
        "-"
    );

    definirTexto(
        campoFbp,
        paciente.fbp || "-"
    );

    definirTexto(
        campoFbc,
        paciente.fbc || "-"
    );

    definirTexto(
        campoIp,
        paciente.ip ||
        paciente.primeiro_ip ||
        "-"
    );

    definirTexto(
        campoUserAgent,
        paciente.user_agent ||
        paciente.useragent ||
        paciente.primeiro_user_agent ||
        "-"
    );

    definirTexto(
        campoLandingPage,
        paciente.landing_page ||
        paciente.page_url ||
        paciente.url ||
        "-"
    );

    definirTexto(
        campoReferer,
        paciente.referer ||
        paciente.referrer ||
        "-"
    );

    definirTexto(
        campoDevice,
        paciente.device ||
        paciente.dispositivo ||
        paciente.ultimo_dispositivo ||
        "-"
    );

}


// ======================================================
// SALVAR PACIENTE
// ======================================================

async function salvarPaciente() {

    if (!pacienteAtual) return;

    const id =
        obterIdPaciente(pacienteAtual);

    if (!id) {

        notificar(
            "Erro",
            "O paciente não possui identificação.",
            "error"
        );

        return;

    }

    const dados = {

        valor_conversao:
            Number(
                valorConversao?.value || 0
            ),

        status_financeiro:
            statusFinanceiro?.value ||
            pacienteAtual.status_financeiro ||
            pacienteAtual.status ||
            "novo",

        observacoes:
            observacoes?.value || ""

    };

    try {

        atualizarEstadoSalvar(true);

        const resposta = await fetch(
    `${API}/api/visitantes`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dados)
        }
    );
            

        if (!resposta.ok) {

            const mensagem =
                await obterMensagemErro(resposta);

            throw new Error(
                mensagem ||
                "Não foi possível salvar."
            );

        }

        fecharDrawerSeguro();

        await carregarPacientes();

        notificar(
            "Paciente atualizado",
            "Os dados foram salvos com sucesso.",
            "success"
        );

    } catch (erro) {

        console.error(
            "Erro salvando paciente:",
            erro
        );

        notificar(
            "Erro",
            erro.message ||
            "Não foi possível salvar o paciente.",
            "error"
        );

    } finally {

        atualizarEstadoSalvar(false);

    }

}


// ======================================================
// NOVO PACIENTE
// ======================================================

function abrirCadastroNovoPaciente() {

    notificar(
        "Novo paciente",
        "O formulário de cadastro será adicionado na próxima etapa.",
        "info"
    );

}


// ======================================================
// EXPORTAR CSV
// ======================================================

function exportarCSV() {

    const lista =
        listaExibida.length > 0
            ? listaExibida
            : pacientes;

    if (lista.length === 0) {

        notificar(
            "Nenhum paciente",
            "Não existem pacientes para exportar.",
            "warning"
        );

        return;

    }

    const linhas = [

        [
            "ID",
            "Nome",
            "Telefone",
            "Origem",
            "Campanha",
            "Status",
            "Valor",
            "Cadastro"
        ]

    ];

    lista.forEach((paciente) => {

        linhas.push([

            obterIdPaciente(paciente) || "",

            paciente.nome || "",

            obterTelefone(paciente),

            obterOrigem(paciente),

            paciente.utm_campaign ||
            paciente.primeira_utm_campaign ||
            "",

            obterNomeStatus(
                obterStatusNormalizado(paciente)
            ),

            obterValorConversao(paciente),

            formatarDataHora(
                obterDataCadastro(paciente)
            )

        ]);

    });

    const csv =
        linhas.map((linha) => {

            return linha
                .map(escaparCampoCSV)
                .join(";");

        }).join("\n");

    const blob =
        new Blob(
            [
                "\uFEFF",
                csv
            ],
            {
                type:
                    "text/csv;charset=utf-8"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        `atlas-pacientes-${obterDataArquivo()}.csv`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}


// ======================================================
// STATUS
// ======================================================

function obterStatusNormalizado(paciente) {

    const status =
        normalizarTexto(
            paciente.status_financeiro ||
            paciente.status ||
            paciente.etapa ||
            ""
        );

    if (
        status.includes("perdid") ||
        status.includes("cancel") ||
        status.includes("nao converteu") ||
        status.includes("não converteu")
    ) {

        return "perdido";

    }

    if (
        status.includes("convert") ||
        status.includes("fech") ||
        status.includes("compareceu") ||
        status.includes("pago")
    ) {

        return "convertido";

    }

    if (
        status.includes("agend") ||
        status.includes("avaliacao") ||
        status.includes("avaliação")
    ) {

        return "agendado";

    }

    if (
        status.includes("atendimento") ||
        status.includes("contato") ||
        status.includes("respond")
    ) {

        return "atendimento";

    }

    return "novo";

}


function obterNomeStatus(status) {

    const nomes = {

        novo:
            "Novo",

        atendimento:
            "Em atendimento",

        agendado:
            "Agendado",

        convertido:
            "Convertido",

        perdido:
            "Perdido"

    };

    return nomes[status] || "Novo";

}


// ======================================================
// HELPERS DE PACIENTE
// ======================================================

function obterIdPaciente(paciente) {

    return (
        paciente.id ??
        paciente.visitante_id ??
        paciente.lead_id ??
        ""
    );

}


function obterTelefone(paciente) {

    return (
        paciente.telefone ||
        paciente.whatsapp ||
        paciente.celular ||
        ""
    );

}


function obterOrigem(paciente) {

    const origem =
        paciente.utm_source ||
        paciente.primeira_utm_source ||
        paciente.ultima_utm_source ||
        paciente.origem ||
        "Direto";

    if (
        normalizarTexto(origem)
            .includes("facebook")
    ) {

        return "Facebook";

    }

    if (
        normalizarTexto(origem)
            .includes("instagram")
    ) {

        return "Instagram";

    }

    if (
        normalizarTexto(origem)
            .includes("google")
    ) {

        return "Google";

    }

    return origem;

}


function obterClasseOrigem(origem) {

    const valor =
        normalizarTexto(origem);

    if (valor.includes("facebook")) {

        return "source-facebook";

    }

    if (valor.includes("instagram")) {

        return "source-instagram";

    }

    if (valor.includes("google")) {

        return "source-google";

    }

    return "source-direct";

}


function obterValorConversao(paciente) {

    return Number(

        paciente.valor_conversao ||
        paciente.valor ||
        paciente.receita ||
        0

    );

}


function obterDataCadastro(paciente) {

    return criarDataValida(

        paciente.created_at ||
        paciente.criado_em ||
        paciente.primeira_visita ||
        paciente.timestamp_cliente

    );

}


function obterDataAtualizacao(paciente) {

    return criarDataValida(

        paciente.updated_at ||
        paciente.atualizado_em ||
        paciente.ultima_visita ||
        paciente.created_at ||
        paciente.criado_em

    );

}


function obterDataAgendamento(paciente) {

    return criarDataValida(

        paciente.data_agendamento ||
        paciente.agendamento ||
        paciente.data_avaliacao ||
        paciente.appointment_date

    );

}


function localizarPaciente(id) {

    return pacientes.find((paciente) => {

        return String(
            obterIdPaciente(paciente)
        ) === String(id);

    });

}


// ======================================================
// FORMATAÇÃO
// ======================================================

function formatarMoeda(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


function formatarTelefone(valor) {

    const telefone =
        limparTelefone(valor);

    if (!telefone) return "-";

    const numero =
        telefone.startsWith("55") &&
        telefone.length > 11
            ? telefone.slice(2)
            : telefone;

    if (numero.length === 11) {

        return numero.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );

    }

    if (numero.length === 10) {

        return numero.replace(
            /(\d{2})(\d{4})(\d{4})/,
            "($1) $2-$3"
        );

    }

    return valor;

}


function limparTelefone(valor) {

    return String(valor || "")
        .replace(/\D/g, "");

}


function formatarDataHora(data) {

    const valor =
        criarDataValida(data);

    if (!valor) return "-";

    return valor.toLocaleString(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );

}


function formatarTempoRelativo(data) {

    const valor =
        criarDataValida(data);

    if (!valor) return "Sem registro";

    const diferenca =
        Date.now() - valor.getTime();

    const minutos =
        Math.floor(
            diferenca / 60000
        );

    if (minutos < 1) {

        return "Agora";

    }

    if (minutos < 60) {

        return `Há ${minutos} min`;

    }

    const horas =
        Math.floor(minutos / 60);

    if (horas < 24) {

        return `Há ${horas} ${
            horas === 1
                ? "hora"
                : "horas"
        }`;

    }

    const dias =
        Math.floor(horas / 24);

    if (dias < 30) {

        return `Há ${dias} ${
            dias === 1
                ? "dia"
                : "dias"
        }`;

    }

    return valor.toLocaleDateString(
        "pt-BR"
    );

}


function obterIniciais(nome) {

    const partes =
        String(nome || "?")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (partes.length === 0) {

        return "?";

    }

    if (partes.length === 1) {

        return partes[0]
            .slice(0, 2)
            .toUpperCase();

    }

    return (
        partes[0][0] +
        partes[partes.length - 1][0]
    ).toUpperCase();

}


// ======================================================
// DATAS
// ======================================================

function criarDataValida(valor) {

    if (!valor) return null;

    const data =
        valor instanceof Date
            ? valor
            : new Date(valor);

    if (
        Number.isNaN(
            data.getTime()
        )
    ) {

        return null;

    }

    return data;

}


function obterInicioDoDia() {

    const data =
        new Date();

    data.setHours(
        0,
        0,
        0,
        0
    );

    return data;

}


function adicionarDias(data, quantidade) {

    const novaData =
        new Date(data);

    novaData.setDate(
        novaData.getDate() +
        quantidade
    );

    return novaData;

}


function obterDataArquivo() {

    return new Date()
        .toISOString()
        .slice(0, 10);

}


// ======================================================
// DRAWER SEGURO
// ======================================================

function abrirDrawerSeguro() {

    if (
        typeof window.abrirDrawer ===
        "function"
    ) {

        window.abrirDrawer();

        return;

    }

    patientDrawer?.classList.add("open");

    document.body.classList.add(
        "drawer-open"
    );

}


function fecharDrawerSeguro() {

    if (
        typeof window.fecharDrawer ===
        "function"
    ) {

        window.fecharDrawer();

        return;

    }

    patientDrawer?.classList.remove("open");

    document.body.classList.remove(
        "drawer-open"
    );

}


// ======================================================
// INTERFACE
// ======================================================

function mostrarCarregamento() {

    if (!tabela) return;

    tabela.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="loading"
            >

                <i class="fa-solid fa-spinner fa-spin"></i>

                Carregando pacientes...

            </td>

        </tr>

    `;

}


function mostrarErroTabela(mensagem) {

    if (!tabela) return;

    tabela.innerHTML = `

        <tr>

            <td
                colspan="6"
                class="empty-state"
            >

                <i class="fa-solid fa-triangle-exclamation"></i>

                <strong>
                    Não foi possível carregar
                </strong>

                <p>
                    ${escapeHtml(mensagem)}
                </p>

            </td>

        </tr>

    `;

}


function atualizarEstadoBotao(ativo) {

    if (!btnAtualizar) return;

    btnAtualizar.disabled = ativo;

    btnAtualizar.innerHTML =
        ativo
            ? `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Atualizando
              `
            : `
                <i class="fa-solid fa-rotate"></i>
                Atualizar
              `;

}


function atualizarEstadoSalvar(ativo) {

    if (!btnSalvarDrawer) return;

    btnSalvarDrawer.disabled = ativo;

    btnSalvarDrawer.innerHTML =
        ativo
            ? `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Salvando
              `
            : `
                <i class="fa-solid fa-floppy-disk"></i>
                Salvar alterações
              `;

}


function definirTexto(elemento, valor) {

    if (!elemento) return;

    elemento.textContent =
        valor ?? "-";

}


// ======================================================
// NOTIFICAÇÕES
// ======================================================

function notificar(
    titulo,
    mensagem,
    tipo = "success"
) {

    if (
        typeof Swal !== "undefined"
    ) {

        Swal.fire({

            icon:
                tipo === "info"
                    ? "info"
                    : tipo,

            title:
                titulo,

            text:
                mensagem,

            timer:
                tipo === "success"
                    ? 1800
                    : undefined,

            showConfirmButton:
                tipo !== "success"

        });

        return;

    }

    console.log(
        `${titulo}: ${mensagem}`
    );

}


// ======================================================
// SEGURANÇA E UTILITÁRIOS
// ======================================================

function normalizarTexto(valor) {

    return String(valor || "")
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}


function escapeHtml(valor) {

    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escaparCampoCSV(valor) {

    const texto =
        String(valor ?? "")
            .replaceAll('"', '""');

    return `"${texto}"`;

}


async function obterMensagemErro(resposta) {

    try {

        const resultado =
            await resposta.json();

        return (
            resultado.erro ||
            resultado.message ||
            null
        );

    } catch {

        return null;

    }

}


function tratarAtalhos(evento) {

    if (evento.key === "Escape") {

        fecharDrawerSeguro();

    }

    if (
        evento.ctrlKey &&
        evento.key.toLowerCase() === "r"
    ) {

        evento.preventDefault();

        carregarPacientes();

    }

}


// ======================================================
// AUTOATUALIZAÇÃO
// ======================================================

setInterval(() => {

    if (
        document.visibilityState === "visible" &&
        !patientDrawer?.classList.contains("open")
    ) {

        carregarPacientes();

    }

}, 60000);


// ======================================================
// COMPATIBILIDADE COM O HTML ANTIGO
// ======================================================

window.abrirPaciente =
    abrirPaciente;

window.salvarPaciente =
    salvarPaciente;


// ======================================================
// FINAL
// ======================================================

console.log(
    "Atlas Tracker — Central de Pacientes V4 iniciada."
);