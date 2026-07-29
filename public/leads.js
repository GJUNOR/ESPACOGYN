"use strict";

// ======================================================
// ATLAS CRM — LEADS / PACIENTES
// ======================================================

const API_LEADS = "/api/leads";

let todosOsLeads = [];
let leadsFiltrados = [];
let leadSelecionado = null;


// ======================================================
// INICIALIZAÇÃO
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("Atlas CRM: leads.js carregado.");

    configurarEventos();
    carregarLeads();
});


// ======================================================
// SELETORES COM ALTERNATIVAS
// ======================================================

function encontrarElemento(...seletores) {
    for (const seletor of seletores) {
        const elemento = document.querySelector(seletor);

        if (elemento) {
            return elemento;
        }
    }

    return null;
}


function obterCorpoTabela() {
    return encontrarElemento(
        "#tabelaPacientes tbody",
        "#tabelaLeads tbody",
        "#pacientesTable tbody",
        "#leadsTable tbody",
        "#corpoTabela",
        "#listaPacientes",
        "#listaLeads",
        "table tbody"
    );
}


function obterCampoBusca() {
    return encontrarElemento(
        "#pesquisa",
        "#busca",
        "#campoBusca",
        "#searchInput",
        "#inputBusca",
        "input[type='search']"
    );
}


// ======================================================
// CARREGAMENTO DA API
// ======================================================

async function carregarLeads() {
    mostrarCarregamento();

    try {
        const resposta = await fetch(API_LEADS, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });

        if (!resposta.ok) {
            const mensagem = await lerMensagemDeErro(resposta);

            throw new Error(
                mensagem ||
                `Erro HTTP ${resposta.status} ao carregar pacientes.`
            );
        }

        const retorno = await resposta.json();

        console.log("Resposta recebida da API:", retorno);

        todosOsLeads = normalizarResposta(retorno);
        leadsFiltrados = [...todosOsLeads];

        console.log("Pacientes normalizados:", todosOsLeads);

        renderizarTudo();
    } catch (erro) {
        console.error("Erro ao carregar pacientes:", erro);
        mostrarErroNaTabela(erro.message);
    }
}


// ======================================================
// NORMALIZAÇÃO DA RESPOSTA
// ======================================================

function normalizarResposta(retorno) {
    if (Array.isArray(retorno)) {
        return retorno;
    }

    if (retorno && Array.isArray(retorno.data)) {
        return retorno.data;
    }

    if (retorno && Array.isArray(retorno.visitantes)) {
        return retorno.visitantes;
    }

    if (retorno && Array.isArray(retorno.leads)) {
        return retorno.leads;
    }

    if (retorno && Array.isArray(retorno.pacientes)) {
        return retorno.pacientes;
    }

    console.warn(
        "A API respondeu, mas não foi encontrado um array de pacientes:",
        retorno
    );

    return [];
}


// ======================================================
// RENDERIZAÇÃO PRINCIPAL
// ======================================================

function renderizarTudo() {
    renderizarTabela(leadsFiltrados);
    atualizarIndicadores(leadsFiltrados);
    atualizarResumo(leadsFiltrados);
}


function renderizarTabela(leads) {
    const tbody = obterCorpoTabela();

    if (!tbody) {
        console.error(
            "Não encontrei o corpo da tabela no leads.html."
        );

        return;
    }

    tbody.innerHTML = "";

    if (!Array.isArray(leads) || leads.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="estado-tabela">
                    Nenhum paciente encontrado.
                </td>
            </tr>
        `;

        return;
    }

    leads.forEach((lead) => {
        const linha = criarLinhaLead(lead);
        tbody.appendChild(linha);
    });
}


function criarLinhaLead(lead) {
    const tr = document.createElement("tr");

    const id = obterPrimeiroValor(
        lead.id,
        lead.visitante_id,
        lead.uuid
    );

    const nome = obterPrimeiroValor(
        lead.nome,
        lead.name,
        lead.nome_completo,
        lead.paciente,
        "Sem nome"
    );

    const telefone = obterPrimeiroValor(
        lead.telefone,
        lead.phone,
        lead.whatsapp,
        lead.celular,
        "-"
    );

    const origem = obterPrimeiroValor(
        lead.origem,
        lead.source,
        lead.utm_source,
        lead.campanha,
        lead.nome_campanha,
        "Direto"
    );

    const campanha = obterPrimeiroValor(
        lead.campanha,
        lead.nome_campanha,
        lead.utm_campaign,
        lead.ad_name,
        "-"
    );

    const status = obterPrimeiroValor(
        lead.status,
        lead.situacao,
        lead.etapa,
        "Novo"
    );

    const responsavel = obterPrimeiroValor(
        lead.responsavel,
        lead.atendente,
        lead.secretaria,
        "-"
    );

    const dataCriacao = obterPrimeiroValor(
        lead.created_at,
        lead.criado_em,
        lead.data_criacao,
        lead.data,
        null
    );

    const ultimaInteracao = obterPrimeiroValor(
        lead.updated_at,
        lead.atualizado_em,
        lead.ultima_interacao,
        lead.data_atualizacao,
        dataCriacao
    );

    tr.dataset.id = id || "";

    tr.innerHTML = `
        <td>
            <div class="paciente-identificacao">
                <div class="paciente-avatar">
                    ${escaparHTML(obterIniciais(nome))}
                </div>

                <div class="paciente-dados">
                    <strong>${escaparHTML(nome)}</strong>
                    <span>${escaparHTML(formatarTelefone(telefone))}</span>
                </div>
            </div>
        </td>

        <td>
            <span class="origem-lead">
                ${escaparHTML(origem)}
            </span>
        </td>

        <td>
            ${escaparHTML(campanha)}
        </td>

        <td>
            <span class="status-badge ${obterClasseStatus(status)}">
                ${escaparHTML(formatarStatus(status))}
            </span>
        </td>

        <td>
            ${escaparHTML(responsavel)}
        </td>

        <td>
            ${escaparHTML(formatarData(dataCriacao))}
        </td>

        <td>
            ${escaparHTML(formatarData(ultimaInteracao))}
        </td>

        <td>
            <button
                type="button"
                class="botao-acao btn-visualizar"
                data-id="${escaparAtributo(id)}"
                aria-label="Visualizar paciente"
                title="Visualizar paciente"
            >
                <i class="fa-solid fa-eye"></i>
                <span class="texto-botao-acao">Ver</span>
            </button>
        </td>
    `;

    tr.addEventListener("click", (evento) => {
        const botao = evento.target.closest(".btn-visualizar");

        if (botao) {
            abrirLead(id);
        }
    });

    return tr;
}


// ======================================================
// INDICADORES E RESUMO
// ======================================================

function atualizarIndicadores(leads) {
    const total = leads.length;

    const novos = leads.filter((lead) => {
        return normalizarTexto(obterStatusLead(lead)) === "novo";
    }).length;

    const emAtendimento = leads.filter((lead) => {
        const status = normalizarTexto(obterStatusLead(lead));

        return [
            "em atendimento",
            "atendimento",
            "contato iniciado",
            "em contato"
        ].includes(status);
    }).length;

    const agendados = leads.filter((lead) => {
        const status = normalizarTexto(obterStatusLead(lead));

        return [
            "agendado",
            "agendada",
            "consulta agendada"
        ].includes(status);
    }).length;

    const convertidos = leads.filter((lead) => {
        const status = normalizarTexto(obterStatusLead(lead));

        return [
            "convertido",
            "convertida",
            "fechado",
            "fechada",
            "venda",
            "cliente"
        ].includes(status);
    }).length;

    atualizarTextoElemento(
        [
            "#totalPacientes",
            "#totalLeads",
            "[data-kpi='total']"
        ],
        total
    );

    atualizarTextoElemento(
        [
            "#novosPacientes",
            "#leadsNovos",
            "#totalNovos",
            "[data-kpi='novos']"
        ],
        novos
    );

    atualizarTextoElemento(
        [
            "#emAtendimento",
            "#totalAtendimento",
            "[data-kpi='atendimento']"
        ],
        emAtendimento
    );

    atualizarTextoElemento(
        [
            "#totalAgendados",
            "#agendados",
            "[data-kpi='agendados']"
        ],
        agendados
    );

    atualizarTextoElemento(
        [
            "#totalConvertidos",
            "#convertidos",
            "[data-kpi='convertidos']"
        ],
        convertidos
    );
}


function atualizarResumo(leads) {
    atualizarTextoElemento(
        [
            "#quantidadeResultados",
            "#contadorResultados",
            "[data-total-resultados]"
        ],
        `${leads.length} paciente${leads.length === 1 ? "" : "s"}`
    );
}


function atualizarTextoElemento(seletores, valor) {
    const elemento = encontrarElemento(...seletores);

    if (elemento) {
        elemento.textContent = String(valor);
    }
}


// ======================================================
// BUSCA E FILTROS
// ======================================================

function configurarEventos() {
    configurarBusca();
    configurarFiltros();
    configurarDrawer();
    configurarFormulario();
}


function configurarBusca() {
    const campoBusca = obterCampoBusca();

    if (!campoBusca) {
        return;
    }

    campoBusca.addEventListener("input", () => {
        aplicarFiltros();
    });
}


function configurarFiltros() {
    const filtros = document.querySelectorAll(
        ".filter-chip, .filtro-chip, [data-filter], [data-filtro]"
    );

    filtros.forEach((filtro) => {
        filtro.addEventListener("click", () => {
            filtros.forEach((item) => {
                item.classList.remove("active");
                item.classList.remove("ativo");
            });

            filtro.classList.add("active");
            filtro.classList.add("ativo");

            aplicarFiltros();
        });
    });
}


function aplicarFiltros() {
    const campoBusca = obterCampoBusca();

    const termo = normalizarTexto(
        campoBusca ? campoBusca.value : ""
    );

    const filtroAtivo = encontrarElemento(
        ".filter-chip.active",
        ".filtro-chip.ativo",
        "[data-filter].active",
        "[data-filtro].ativo"
    );

    const valorFiltro = normalizarTexto(
        filtroAtivo
            ? (
                filtroAtivo.dataset.filter ||
                filtroAtivo.dataset.filtro ||
                filtroAtivo.textContent
            )
            : "todos"
    );

    leadsFiltrados = todosOsLeads.filter((lead) => {
        const nome = normalizarTexto(
            obterPrimeiroValor(
                lead.nome,
                lead.name,
                lead.nome_completo
            )
        );

        const telefone = normalizarTexto(
            obterPrimeiroValor(
                lead.telefone,
                lead.phone,
                lead.whatsapp,
                lead.celular
            )
        );

        const campanha = normalizarTexto(
            obterPrimeiroValor(
                lead.campanha,
                lead.nome_campanha,
                lead.utm_campaign
            )
        );

        const origem = normalizarTexto(
            obterPrimeiroValor(
                lead.origem,
                lead.source,
                lead.utm_source
            )
        );

        const status = normalizarTexto(
            obterStatusLead(lead)
        );

        const correspondeBusca =
            termo === "" ||
            nome.includes(termo) ||
            telefone.includes(termo) ||
            campanha.includes(termo) ||
            origem.includes(termo) ||
            status.includes(termo);

        const correspondeFiltro =
            valorFiltro === "" ||
            valorFiltro === "todos" ||
            valorFiltro === "todas" ||
            status.includes(valorFiltro);

        return correspondeBusca && correspondeFiltro;
    });

    renderizarTudo();
}


// ======================================================
// DRAWER / DETALHES DO PACIENTE
// ======================================================

function configurarDrawer() {
    const botoesFechar = document.querySelectorAll(
        "#fecharDrawer, .fechar-drawer, [data-close-drawer]"
    );

    botoesFechar.forEach((botao) => {
        botao.addEventListener("click", fecharDrawer);
    });

    const overlay = encontrarElemento(
        "#drawerOverlay",
        ".drawer-overlay",
        "[data-drawer-overlay]"
    );

    if (overlay) {
        overlay.addEventListener("click", fecharDrawer);
    }

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            fecharDrawer();
        }
    });
}


function abrirLead(id) {
    const lead = todosOsLeads.find((item) => {
        const itemId = obterPrimeiroValor(
            item.id,
            item.visitante_id,
            item.uuid
        );

        return String(itemId) === String(id);
    });

    if (!lead) {
        console.error("Paciente não encontrado:", id);
        return;
    }

    leadSelecionado = lead;

    preencherDrawer(lead);

    const drawer = encontrarElemento(
        "#drawerPaciente",
        "#leadDrawer",
        ".drawer-paciente",
        ".lead-drawer",
        "[data-drawer]"
    );

    const overlay = encontrarElemento(
        "#drawerOverlay",
        ".drawer-overlay",
        "[data-drawer-overlay]"
    );

    if (drawer) {
        drawer.classList.add("open");
        drawer.classList.add("ativo");
        drawer.setAttribute("aria-hidden", "false");
    }

    if (overlay) {
        overlay.classList.add("active");
        overlay.classList.add("ativo");
    }

    document.body.classList.add("drawer-aberto");
}


function fecharDrawer() {
    const drawer = encontrarElemento(
        "#drawerPaciente",
        "#leadDrawer",
        ".drawer-paciente",
        ".lead-drawer",
        "[data-drawer]"
    );

    const overlay = encontrarElemento(
        "#drawerOverlay",
        ".drawer-overlay",
        "[data-drawer-overlay]"
    );

    if (drawer) {
        drawer.classList.remove("open");
        drawer.classList.remove("ativo");
        drawer.setAttribute("aria-hidden", "true");
    }

    if (overlay) {
        overlay.classList.remove("active");
        overlay.classList.remove("ativo");
    }

    document.body.classList.remove("drawer-aberto");
}


function preencherDrawer(lead) {
    preencherCampo(
        ["#leadId", "#pacienteId", "[name='id']"],
        obterPrimeiroValor(
            lead.id,
            lead.visitante_id,
            lead.uuid
        )
    );

    preencherCampo(
        ["#nome", "#nomePaciente", "[name='nome']"],
        obterPrimeiroValor(
            lead.nome,
            lead.name,
            lead.nome_completo
        )
    );

    preencherCampo(
        [
            "#telefone",
            "#telefonePaciente",
            "[name='telefone']"
        ],
        obterPrimeiroValor(
            lead.telefone,
            lead.phone,
            lead.whatsapp,
            lead.celular
        )
    );

    preencherCampo(
        ["#email", "#emailPaciente", "[name='email']"],
        obterPrimeiroValor(
            lead.email,
            lead.email_address
        )
    );

    preencherCampo(
        ["#status", "#statusPaciente", "[name='status']"],
        obterStatusLead(lead)
    );

    preencherCampo(
        [
            "#responsavel",
            "#responsavelPaciente",
            "[name='responsavel']"
        ],
        obterPrimeiroValor(
            lead.responsavel,
            lead.atendente,
            lead.secretaria
        )
    );

    preencherCampo(
        [
            "#observacoes",
            "#observacao",
            "[name='observacoes']"
        ],
        obterPrimeiroValor(
            lead.observacoes,
            lead.observacao,
            lead.notes
        )
    );

    preencherTexto(
        [
            "#drawerNome",
            "#tituloPaciente",
            "[data-paciente-nome]"
        ],
        obterPrimeiroValor(
            lead.nome,
            lead.name,
            lead.nome_completo,
            "Paciente"
        )
    );

    preencherTexto(
        [
            "#drawerTelefone",
            "[data-paciente-telefone]"
        ],
        formatarTelefone(
            obterPrimeiroValor(
                lead.telefone,
                lead.phone,
                lead.whatsapp,
                lead.celular,
                "-"
            )
        )
    );
}


function preencherCampo(seletores, valor) {
    const campo = encontrarElemento(...seletores);

    if (campo) {
        campo.value = valor ?? "";
    }
}


function preencherTexto(seletores, valor) {
    const elemento = encontrarElemento(...seletores);

    if (elemento) {
        elemento.textContent = valor ?? "";
    }
}


// ======================================================
// SALVAMENTO DO PACIENTE
// ======================================================

function configurarFormulario() {
    const formulario = encontrarElemento(
        "#formPaciente",
        "#formLead",
        ".form-paciente",
        "[data-form-paciente]"
    );

    if (formulario) {
        formulario.addEventListener(
            "submit",
            salvarLead
        );
    }

    const botaoSalvar = encontrarElemento(
        "#salvarPaciente",
        "#salvarLead",
        ".btn-salvar-paciente",
        "[data-save-paciente]"
    );

    if (
        botaoSalvar &&
        (!formulario || botaoSalvar.form !== formulario)
    ) {
        botaoSalvar.addEventListener(
            "click",
            salvarLead
        );
    }
}


async function salvarLead(evento) {
    if (evento) {
        evento.preventDefault();
    }

    if (!leadSelecionado) {
        alert("Nenhum paciente foi selecionado.");
        return;
    }

    const id = obterPrimeiroValor(
        leadSelecionado.id,
        leadSelecionado.visitante_id,
        leadSelecionado.uuid
    );

    if (!id) {
        alert("Não foi possível identificar o paciente.");
        return;
    }

    const dados = coletarDadosDoFormulario();

    const botaoSalvar = encontrarElemento(
        "#salvarPaciente",
        "#salvarLead",
        ".btn-salvar-paciente",
        "[data-save-paciente]"
    );

    definirBotaoCarregando(botaoSalvar, true);

    try {
        const resposta = await fetch(
            `${API_LEADS}/${encodeURIComponent(id)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(dados)
            }
        );

        if (!resposta.ok) {
            const mensagem = await lerMensagemDeErro(resposta);

            throw new Error(
                mensagem ||
                `Erro HTTP ${resposta.status} ao atualizar paciente.`
            );
        }

        const retorno = await resposta.json().catch(() => null);

        console.log("Paciente atualizado:", retorno);

        mostrarMensagem(
            "Paciente atualizado com sucesso.",
            "sucesso"
        );

        fecharDrawer();
        await carregarLeads();
    } catch (erro) {
        console.error("Erro ao atualizar paciente:", erro);

        mostrarMensagem(
            erro.message || "Não foi possível atualizar o paciente.",
            "erro"
        );
    } finally {
        definirBotaoCarregando(botaoSalvar, false);
    }
}


function coletarDadosDoFormulario() {
    const nome = obterValorCampo(
        "#nome",
        "#nomePaciente",
        "[name='nome']"
    );

    const telefone = obterValorCampo(
        "#telefone",
        "#telefonePaciente",
        "[name='telefone']"
    );

    const email = obterValorCampo(
        "#email",
        "#emailPaciente",
        "[name='email']"
    );

    const status = obterValorCampo(
        "#status",
        "#statusPaciente",
        "[name='status']"
    );

    const responsavel = obterValorCampo(
        "#responsavel",
        "#responsavelPaciente",
        "[name='responsavel']"
    );

    const observacoes = obterValorCampo(
        "#observacoes",
        "#observacao",
        "[name='observacoes']"
    );

    const dados = {};

    if (nome !== null) {
        dados.nome = nome;
    }

    if (telefone !== null) {
        dados.telefone = telefone;
    }

    if (email !== null) {
        dados.email = email;
    }

    if (status !== null) {
        dados.status = status;
    }

    if (responsavel !== null) {
        dados.responsavel = responsavel;
    }

    if (observacoes !== null) {
        dados.observacoes = observacoes;
    }

    return dados;
}


function obterValorCampo(...seletores) {
    const campo = encontrarElemento(...seletores);

    if (!campo) {
        return null;
    }

    return String(campo.value ?? "").trim();
}


// ======================================================
// ESTADOS DA TABELA
// ======================================================

function mostrarCarregamento() {
    const tbody = obterCorpoTabela();

    if (!tbody) {
        return;
    }

    tbody.innerHTML = `
        <tr>
            <td colspan="10" class="estado-tabela">
                Carregando pacientes...
            </td>
        </tr>
    `;
}


function mostrarErroNaTabela(mensagem) {
    const tbody = obterCorpoTabela();

    if (!tbody) {
        return;
    }

    tbody.innerHTML = `
        <tr>
            <td colspan="10" class="estado-tabela estado-erro">
                Não foi possível carregar os pacientes.
                <br>
                <small>${escaparHTML(mensagem)}</small>
                <br>
                <button
                    type="button"
                    class="botao-tentar-novamente"
                    id="tentarNovamente"
                >
                    Tentar novamente
                </button>
            </td>
        </tr>
    `;

    const botao = document.querySelector(
        "#tentarNovamente"
    );

    if (botao) {
        botao.addEventListener("click", carregarLeads);
    }
}


// ======================================================
// MENSAGENS
// ======================================================

function mostrarMensagem(texto, tipo = "sucesso") {
    const mensagemExistente = document.querySelector(
        ".atlas-mensagem"
    );

    if (mensagemExistente) {
        mensagemExistente.remove();
    }

    const mensagem = document.createElement("div");

    mensagem.className =
        `atlas-mensagem atlas-mensagem-${tipo}`;

    mensagem.textContent = texto;

    document.body.appendChild(mensagem);

    window.setTimeout(() => {
        mensagem.classList.add("visivel");
    }, 10);

    window.setTimeout(() => {
        mensagem.classList.remove("visivel");

        window.setTimeout(() => {
            mensagem.remove();
        }, 300);
    }, 3000);
}


function definirBotaoCarregando(botao, carregando) {
    if (!botao) {
        return;
    }

    if (carregando) {
        botao.dataset.textoOriginal =
            botao.innerHTML;

        botao.disabled = true;
        botao.innerHTML = "Salvando...";
    } else {
        botao.disabled = false;

        if (botao.dataset.textoOriginal) {
            botao.innerHTML =
                botao.dataset.textoOriginal;
        }
    }
}


// ======================================================
// FUNÇÕES AUXILIARES
// ======================================================

function obterStatusLead(lead) {
    return obterPrimeiroValor(
        lead.status,
        lead.situacao,
        lead.etapa,
        "Novo"
    );
}


function obterPrimeiroValor(...valores) {
    for (const valor of valores) {
        if (
            valor !== undefined &&
            valor !== null &&
            String(valor).trim() !== ""
        ) {
            return valor;
        }
    }

    return "";
}


function normalizarTexto(valor) {
    return String(valor ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}


function obterIniciais(nome) {
    const partes = String(nome ?? "")
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
        partes[0].charAt(0) +
        partes[partes.length - 1].charAt(0)
    ).toUpperCase();
}


function formatarTelefone(valor) {
    const telefoneOriginal = String(valor ?? "").trim();

    if (!telefoneOriginal || telefoneOriginal === "-") {
        return "-";
    }

    const numeros = telefoneOriginal.replace(/\D/g, "");

    let telefone = numeros;

    if (
        telefone.length === 12 ||
        telefone.length === 13
    ) {
        if (telefone.startsWith("55")) {
            telefone = telefone.slice(2);
        }
    }

    if (telefone.length === 11) {
        return telefone.replace(
            /^(\d{2})(\d{5})(\d{4})$/,
            "($1) $2-$3"
        );
    }

    if (telefone.length === 10) {
        return telefone.replace(
            /^(\d{2})(\d{4})(\d{4})$/,
            "($1) $2-$3"
        );
    }

    return telefoneOriginal;
}


function formatarData(valor) {
    if (!valor) {
        return "-";
    }

    const data = new Date(valor);

    if (Number.isNaN(data.getTime())) {
        return String(valor);
    }

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(data);
}


function formatarStatus(status) {
    const texto = String(status ?? "").trim();

    if (!texto) {
        return "Novo";
    }

    return texto
        .split(/[_-]/)
        .join(" ")
        .replace(/\b\w/g, (letra) => {
            return letra.toUpperCase();
        });
}


function obterClasseStatus(status) {
    const valor = normalizarTexto(status);

    if (
        [
            "convertido",
            "convertida",
            "fechado",
            "fechada",
            "cliente"
        ].includes(valor)
    ) {
        return "status-convertido";
    }

    if (
        [
            "agendado",
            "agendada",
            "consulta agendada"
        ].includes(valor)
    ) {
        return "status-agendado";
    }

    if (
        [
            "em atendimento",
            "atendimento",
            "em contato",
            "contato iniciado"
        ].includes(valor)
    ) {
        return "status-atendimento";
    }

    if (
        [
            "perdido",
            "perdida",
            "cancelado",
            "cancelada",
            "nao respondeu",
            "não respondeu"
        ].includes(valor)
    ) {
        return "status-perdido";
    }

    return "status-novo";
}


function escaparHTML(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escaparAtributo(valor) {
    return escaparHTML(valor);
}


async function lerMensagemDeErro(resposta) {
    try {
        const corpo = await resposta.json();

        return (
            corpo.message ||
            corpo.mensagem ||
            corpo.error ||
            corpo.erro ||
            JSON.stringify(corpo)
        );
    } catch {
        try {
            return await resposta.text();
        } catch {
            return "";
        }
    }
}