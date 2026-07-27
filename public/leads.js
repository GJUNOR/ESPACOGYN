// ======================================================
// ATLAS CRM
// LEADS.JS V3
// ======================================================

const API = "http://localhost:3000";

// ======================================================
// ELEMENTOS
// ======================================================

// Tabela

const tabela = document.getElementById("tabelaPacientes");

const contadorPacientes =
document.getElementById("contadorPacientes");

// Pesquisa

const pesquisa =
document.getElementById("pesquisa");

// Cards

const totalLeads =
document.getElementById("totalLeads");

const agendados =
document.getElementById("agendados");

const compareceram =
document.getElementById("compareceram");

const receitaTotal =
document.getElementById("receitaTotal");

// Botões

const btnAtualizar =
document.getElementById("btnAtualizar");

const btnExportar =
document.getElementById("btnExportar");

const btnSalvarDrawer =
document.getElementById("btnSalvarDrawer");

// Drawer

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

// Marketing

const drawerCampanha =
document.getElementById("drawerCampanha");

const drawerConjunto =
document.getElementById("drawerConjunto");

const drawerAnuncio =
document.getElementById("drawerAnuncio");

const drawerOrigemMarketing =
document.getElementById("drawerOrigemMarketing");

// Resultado

const valorConversao =
document.getElementById("valorConversao");

const statusFinanceiro =
document.getElementById("statusFinanceiro");

const observacoes =
document.getElementById("observacoes");

// Painel Técnico

const utm_source =
document.getElementById("utm_source");

const utm_medium =
document.getElementById("utm_medium");

const utm_campaign =
document.getElementById("utm_campaign");

const utm_content =
document.getElementById("utm_content");

const utm_term =
document.getElementById("utm_term");

const fbclid =
document.getElementById("fbclid");

const fbp =
document.getElementById("fbp");

const fbc =
document.getElementById("fbc");

const ip =
document.getElementById("ip");

const useragent =
document.getElementById("useragent");

const landing_page =
document.getElementById("landing_page");

const referer =
document.getElementById("referer");

const device =
document.getElementById("device");

// ======================================================
// VARIÁVEIS
// ======================================================

let pacientes = [];

let pacienteAtual = null;

// ======================================================
// INICIALIZAÇÃO
// ======================================================

window.addEventListener("load", () => {

    carregarPacientes();

});

// ======================================================
// CARREGAR PACIENTES
// ======================================================

async function carregarPacientes(){

    tabela.innerHTML = `

        <tr>

            <td colspan="7" class="loading">

                Carregando pacientes...

            </td>

        </tr>

    `;

    try{

        const resposta = await fetch(

            `${API}/leads`

        );

        if(!resposta.ok){

            throw new Error("Erro");

        }

        pacientes = await resposta.json();

        renderizarTabela(pacientes);

        atualizarCards();

    }

    catch(erro){

        console.error(erro);

        tabela.innerHTML = `

            <tr>

                <td colspan="7">

                    Erro ao carregar pacientes.

                </td>

            </tr>

        `;

    }

}
// ======================================================
// RENDERIZAR TABELA
// ======================================================

function renderizarTabela(lista){

    contadorPacientes.textContent =
        `${lista.length} registros`;

    if(lista.length === 0){

        tabela.innerHTML = `

            <tr>

                <td colspan="7">

                    <div class="empty-state">

                        <i class="fa-solid fa-users-slash"></i>

                        <h3>Nenhum paciente encontrado</h3>

                        <p>

                            Não existe nenhum paciente com esse filtro.

                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }

    tabela.innerHTML = "";

    lista.forEach((paciente,index)=>{

        const inicial = paciente.nome
            ? paciente.nome.charAt(0).toUpperCase()
            : "?";

        const telefone =
            paciente.telefone ||
            paciente.whatsapp ||
            "-";

        const origem =
            paciente.utm_source ||
            paciente.origem ||
            "Meta Ads";

        const valor =
            Number(
                paciente.valor_conversao || 0
            );

        const data =
            paciente.created_at
            ? new Date(
                paciente.created_at
            ).toLocaleDateString("pt-BR")
            : "-";

        tabela.innerHTML += `

        <tr>

            <td>

                <div class="patient">

                    <div class="avatar">

                        ${inicial}

                    </div>

                    <div class="patient-name">

                        <strong>

                            ${paciente.nome || "Sem nome"}

                        </strong>

                        <small>

                            Lead #${paciente.id ?? index+1}

                        </small>

                    </div>

                </div>

            </td>

            <td>

                ${telefone}

            </td>

            <td>

                ${origem}

            </td>

            <td>

                ${obterStatus(paciente)}

            </td>

            <td class="money">

                ${valor.toLocaleString("pt-BR",{

                    style:"currency",

                    currency:"BRL"

                })}

            </td>

            <td>

                ${data}

            </td>

            <td>

                <button

                    class="table-btn"

                    onclick="abrirPaciente(${index})">

                    <i class="fa-solid fa-eye"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

// ======================================================
// BADGE STATUS
// ======================================================

function obterStatus(paciente){

    const status = (

        paciente.status_financeiro ||

        paciente.status ||

        ""

    ).toLowerCase();

    if(status.includes("converteu")){

        return `<span class="badge green">Converteu</span>`;

    }

    if(status.includes("agend")){

        return `<span class="badge blue">Agendado</span>`;

    }

    if(status.includes("compare")){

        return `<span class="badge yellow">Compareceu</span>`;

    }

    return `<span class="badge red">Lead</span>`;

}

// ======================================================
// ATUALIZAR CARDS
// ======================================================

function atualizarCards(){

    totalLeads.textContent = pacientes.length;

    let totalAgendados = 0;

    let totalCompareceram = 0;

    let receita = 0;

    pacientes.forEach(p=>{

        const status = (

            p.status_financeiro ||

            p.status ||

            ""

        ).toLowerCase();

        if(status.includes("agend")){

            totalAgendados++;

        }

        if(status.includes("compare")){

            totalCompareceram++;

        }

        receita += Number(

            p.valor_conversao || 0

        );

    });

    agendados.textContent =
        totalAgendados;

    compareceram.textContent =
        totalCompareceram;

    receitaTotal.textContent =
        receita.toLocaleString(

            "pt-BR",

            {

                style:"currency",

                currency:"BRL"

            }

        );

}
// ======================================================
// ABRIR PACIENTE
// ======================================================

function abrirPaciente(indice){

    pacienteAtual = pacientes[indice];

    if(!pacienteAtual) return;

    // Informações

    drawerNome.textContent =
        pacienteAtual.nome || "Sem nome";

    drawerLead.textContent =
        "Lead #" + (pacienteAtual.id || indice + 1);

    drawerTelefone.textContent =
        pacienteAtual.telefone ||
        pacienteAtual.whatsapp ||
        "-";

    drawerCadastro.textContent =
        pacienteAtual.created_at
        ? new Date(
            pacienteAtual.created_at
        ).toLocaleString("pt-BR")
        : "-";

    drawerOrigem.textContent =
        pacienteAtual.origem ||
        pacienteAtual.utm_source ||
        "Meta Ads";

    drawerStatus.textContent =
        pacienteAtual.status_financeiro ||
        pacienteAtual.status ||
        "Lead";

    // Marketing

    drawerCampanha.textContent =
        pacienteAtual.utm_campaign || "-";

    drawerConjunto.textContent =
        pacienteAtual.adset_name ||
        pacienteAtual.conjunto ||
        "-";

    drawerAnuncio.textContent =
        pacienteAtual.ad_name ||
        pacienteAtual.anuncio ||
        "-";

    drawerOrigemMarketing.textContent =
        pacienteAtual.utm_source || "-";

    // Resultado

    valorConversao.value =
        pacienteAtual.valor_conversao || "";

    statusFinanceiro.value =
        pacienteAtual.status_financeiro ||
        "Não converteu";

    observacoes.value =
        pacienteAtual.observacoes || "";

    preencherDadosTecnicos();

    abrirDrawer();

}

// ======================================================
// PREENCHER DADOS TÉCNICOS
// ======================================================

function preencherDadosTecnicos(){

    if(!pacienteAtual) return;

    utm_source.textContent =
        pacienteAtual.utm_source || "-";

    utm_medium.textContent =
        pacienteAtual.utm_medium || "-";

    utm_campaign.textContent =
        pacienteAtual.utm_campaign || "-";

    utm_content.textContent =
        pacienteAtual.utm_content || "-";

    utm_term.textContent =
        pacienteAtual.utm_term || "-";

    fbclid.textContent =
        pacienteAtual.fbclid || "-";

    fbp.textContent =
        pacienteAtual.fbp || "-";

    fbc.textContent =
        pacienteAtual.fbc || "-";

    ip.textContent =
        pacienteAtual.ip || "-";

    useragent.textContent =
        pacienteAtual.user_agent ||
        pacienteAtual.useragent ||
        "-";

    landing_page.textContent =
        pacienteAtual.landing_page ||
        pacienteAtual.page_url ||
        "-";

    referer.textContent =
        pacienteAtual.referer || "-";

    device.textContent =
        pacienteAtual.device ||
        pacienteAtual.dispositivo ||
        "-";

}

// ======================================================
// SALVAR PACIENTE
// ======================================================

async function salvarPaciente(){

    if(!pacienteAtual) return;

    try{

        const resposta = await fetch(

            `${API}/leads/${pacienteAtual.id}`,

            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    valor_conversao:Number(

                        valorConversao.value || 0

                    ),

                    status_financeiro:

                        statusFinanceiro.value,

                    observacoes:

                        observacoes.value

                })

            }

        );

        if(!resposta.ok){

            throw new Error("Erro ao salvar");

        }

        await carregarPacientes();

        fecharDrawer();

        Swal.fire({

            icon:"success",

            title:"Paciente atualizado!",

            text:"Os dados foram salvos com sucesso.",

            timer:1800,

            showConfirmButton:false

        });

    }

    catch(erro){

        console.error(erro);

        Swal.fire({

            icon:"error",

            title:"Erro",

            text:"Não foi possível salvar."

        });

    }

}
// ======================================================
// PESQUISA
// ======================================================

function pesquisarPacientes(){

    const texto = pesquisa.value
        .toLowerCase()
        .trim();

    if(texto === ""){

        renderizarTabela(pacientes);

        return;

    }

    const filtrados = pacientes.filter(p=>{

        return(

            (p.nome || "")
            .toLowerCase()
            .includes(texto)

            ||

            (p.telefone || p.whatsapp || "")
            .toLowerCase()
            .includes(texto)

            ||

            (p.utm_source || "")
            .toLowerCase()
            .includes(texto)

            ||

            (p.utm_campaign || "")
            .toLowerCase()
            .includes(texto)

            ||

            (p.adset_name || "")
            .toLowerCase()
            .includes(texto)

            ||

            (p.ad_name || "")
            .toLowerCase()
            .includes(texto)

        );

    });

    renderizarTabela(filtrados);

}

// ======================================================
// EXPORTAR CSV
// ======================================================

function exportarCSV(){

    if(pacientes.length===0){

        Swal.fire({

            icon:"warning",

            title:"Nenhum paciente",

            text:"Não existem pacientes para exportar."

        });

        return;

    }

    const linhas=[];

    linhas.push([

        "ID",

        "Nome",

        "Telefone",

        "Origem",

        "Campanha",

        "Conjunto",

        "Anúncio",

        "Status",

        "Valor",

        "Cadastro"

    ]);

    pacientes.forEach(p=>{

        linhas.push([

            p.id || "",

            p.nome || "",

            p.telefone || p.whatsapp || "",

            p.utm_source || "",

            p.utm_campaign || "",

            p.adset_name || "",

            p.ad_name || "",

            p.status_financeiro || "",

            p.valor_conversao || 0,

            p.created_at || ""

        ]);

    });

    const csv = linhas

        .map(e=>e.join(";"))

        .join("\n");

    const blob = new Blob(

        [csv],

        {

            type:"text/csv;charset=utf-8"

        }

    );

    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);

    link.download="atlas-pacientes.csv";

    link.click();

}

// ======================================================
// EVENTOS
// ======================================================

btnAtualizar?.addEventListener(

    "click",

    carregarPacientes

);

btnExportar?.addEventListener(

    "click",

    exportarCSV

);

valorConversao?.addEventListener(

    "change",

    salvarPaciente

);

statusFinanceiro?.addEventListener(

    "change",

    salvarPaciente

);

observacoes?.addEventListener(

    "blur",

    salvarPaciente

);

// ======================================================
// ATALHOS
// ======================================================

document.addEventListener(

    "keydown",

    e=>{

        if(e.key==="Escape"){

            fecharDrawer();

        }

        if(

            e.ctrlKey &&

            e.key.toLowerCase()==="r"

        ){

            e.preventDefault();

            carregarPacientes();

        }

    }

);

// ======================================================
// AUTO REFRESH
// ======================================================

setInterval(()=>{

    carregarPacientes();

},60000);

// ======================================================
// FINAL
// ======================================================

console.log("================================");

console.log("ATLAS CRM V3");

console.log("Sistema iniciado.");

console.log("Pacientes:",pacientes.length);

console.log("================================");