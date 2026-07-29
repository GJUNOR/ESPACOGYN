'use strict';
// ================= CONFIG =================
const API_URL = "/api/visitantes";
// ================= ELEMENTOS =================
const $ = (selector) =>
 document.querySelector(selector);
const tabela =
 $("#tabelaVisitantes");
const btnAtualizar =
 $("#atualizarVisitantes");
const busca =
 $("#buscarVisitante");
// ================= ESTADO =================
let visitantes = [];
let visitantesFiltrados = [];
// ================= FORMATADORES =================
function formatarData(data){
 if(!data) return "-";
 return new Date(data)
 .toLocaleString("pt-BR");
}
// ================= API =================
async function buscarVisitantes(){
 const resposta = await fetch(API_URL,{
 headers:{
 "Accept":"application/json"
 }
 });
 if(!resposta.ok){
 throw new Error(
 "Erro ao carregar visitantes"
 );
 }
 return await resposta.json();
}
// ================= CARREGAR =================
async function carregarVisitantes(){
 try{
 visitantes =
 await buscarVisitantes();
 visitantesFiltrados =
 visitantes;
 renderizarTabela();
 atualizarCards();
 }catch(erro){
 console.error(
 erro
 );
 }
}
// ================= EVENTOS =================
document.addEventListener(
 "DOMContentLoaded",
 ()=>{
 carregarVisitantes();
 }
);
btnAtualizar?.addEventListener(
 "click",
 ()=>{
 carregarVisitantes();
 }
);
function renderizarTabela(){
 if(!tabela) return;
 tabela.innerHTML = "";
 visitantesFiltrados.forEach((item)=>{
 const linha =
 document.createElement("tr");
 linha.innerHTML = `
 <td>
 ${item.visitante_id || "-"}
 </td>
 <td>
 ${formatarData(item.primeira_visita)}
 </td>
 <td>
 ${formatarData(item.ultima_visita)}
 </td>
 <td>
 ${item.total_visitas || 0}
 </td>
 <td>
 ${item.primeira_utm_source || "Direto"}
 </td>
 <td>
 ${item.primeira_utm_campaign || "Sem campanha"}
 </td>
 <td>
 ${item.dispositivo || "-"}
 </td>
 <td>
 <button
 class="btn btn-primary btn-detalhes"
 data-id="${item.visitante_id}">
 Ver
 </button>
 </td>
 `;
 tabela.appendChild(linha);
 });
 ativarBotoesDetalhes();
}
// ================= DETALHES =================
function ativarBotoesDetalhes(){
 document
 .querySelectorAll(".btn-detalhes")
 .forEach(botao=>{
 botao.addEventListener(
 "click",
 ()=>{
 const id =
 botao.dataset.id;
 abrirDetalhes(id);
 }
 );
 });
}
// ================= MODAL =================
function abrirDetalhes(id){
 const visitante =
 visitantes.find(
 item =>
 item.visitante_id === id
 );
 if(!visitante) return;
 const modal =
 $("#modalVisitante");
 const dados =
 $("#dadosVisitante");
 if(!modal || !dados) return;
 dados.innerHTML = `
 <div class="detail-item">
 <span>ID</span>
 <strong>${visitante.visitante_id}</strong>
 </div>
 <div class="detail-item">
 <span>Primeira visita</span>
 <strong>
 ${formatarData(visitante.primeira_visita)}
 </strong>
 </div>
 <div class="detail-item">
 <span>Última visita</span>
 <strong>
 ${formatarData(visitante.ultima_visita)}
 </strong>
 </div>
 <div class="detail-item">
 <span>Total visitas</span>
 <strong>
 ${visitante.total_visitas}
 </strong>
 </div>
 `;
 modal.classList.remove(
 "is-hidden"
 );
}
const filtroOrigem =
 $("#filtroOrigem");
const filtroDispositivo =
 $("#filtroDispositivo");
function aplicarFiltros(){
 const texto =
 busca?.value
 .toLowerCase()
 || "";
 const origem =
 filtroOrigem?.value
 || "";
 const dispositivo =
 filtroDispositivo?.value
 || "";
 visitantesFiltrados =
 visitantes.filter(item=>{
 const id =
 String(
 item.visitante_id || ""
 )
 .toLowerCase();
 const buscaOk =
 id.includes(texto);
 const origemOk =
 !origem ||
 item.primeira_utm_source
 === origem;
 const dispositivoOk =
 !dispositivo ||
 item.dispositivo
 === dispositivo;
 return
 buscaOk &&
 origemOk &&
 dispositivoOk;
 });
 renderizarTabela();
}
// ================= EVENTOS FILTRO =================
busca?.addEventListener(
 "input",
 aplicarFiltros
);
filtroOrigem?.addEventListener(
 "change",
 aplicarFiltros
);
filtroDispositivo?.addEventListener(
 "change",
 aplicarFiltros
);
// ================= CARDS =================
function atualizarCards(){
 const total =
 visitantes.length;
 const novos =
 visitantes.filter(
 item =>
 item.total_visitas === 1
 )
 .length;
 const retornantes =
 visitantes.filter(
 item =>
 item.total_visitas > 1
 )
 .length;
 const media =
 total ?
 (
 visitantes.reduce(
 (soma,item)=>
 soma + Number(item.total_visitas || 0),
 0
 )
 /
 total
 )
 .toFixed(1)
 :
 0;
 $("#totalVisitantes")
 .textContent =
 total;
 $("#novosVisitantes")
 .textContent =
 novos;
 $("#visitantesRetorno")
 .textContent =
 retornantes;
 $("#mediaVisitas")
 .textContent =
 media;
}
const fecharModal =
 $("#fecharModal");
fecharModal?.addEventListener(
 "click",
 ()=>{
 $("#modalVisitante")
 ?.classList
 .add("is-hidden");
 }
);
// Fecha clicando fora
$("#modalVisitante")
?.addEventListener(
 "click",
 (evento)=>{
 if(
 evento.target.id ===
 "modalVisitante"
 ){
 evento.target
 .classList
 .add("is-hidden");
 }
 }
);
// ================= DETALHES COMPLETOS =================
function preencherDetalhesVisitante(visitante){
 const dados =
 $("#dadosVisitante");
 if(!dados) return;
 dados.innerHTML = `
 <div class="detail-item">
 <span>ID Visitante</span>
 <strong>
 ${visitante.visitante_id || "-"}
 </strong>
 </div>
 <div class="detail-item">
 <span>Primeira visita</span>
 <strong>
 ${formatarData(
 visitante.primeira_visita
 )}
 </strong>
 </div>
 <div class="detail-item">
 <span>Última visita</span>
 <strong>
 ${formatarData(
 visitante.ultima_visita
 )}
 </strong>
 </div>
 <div class="detail-item">
 <span>Total de acessos</span>
 <strong>
 ${visitante.total_visitas || 0}
 </strong>
 </div>
 <div class="detail-item">
 <span>Origem</span>
 <strong>
 ${visitante.primeira_utm_source || "Direto"}
 </strong>
 </div>
 <div class="detail-item">
 <span>Campanha</span>
 <strong>
 ${visitante.primeira_utm_campaign || "Sem campanha"}
 </strong>
 </div>
 <div class="detail-item">
 <span>Navegador</span>
 <strong>
 ${visitante.navegador || "-"}
 </strong>
 </div>
 <div class="detail-item">
 <span>Sistema</span>
 <strong>
 ${visitante.sistema || "-"}
 </strong>
 </div>
 <div class="detail-item">
 <span>Dispositivo</span>
 <strong>
 ${visitante.dispositivo || "-"}
 </strong>
 </div>
 `;
}
// Atualiza função abrirDetalhes
function abrirDetalhes(id){
 const visitante =
 visitantes.find(
 item =>
 item.visitante_id === id
 );
 if(!visitante) return;
 preencherDetalhesVisitante(
 visitante
 );
 $("#modalVisitante")
 ?.classList
 .remove("is-hidden");
}
function verificarListaVazia(){
 if(!tabela) return;
 if(
 visitantesFiltrados.length === 0
 ){
 tabela.innerHTML = `
 <tr>
 <td colspan="8">
 <div class="empty">
 Nenhum visitante encontrado.
 </div>
 </td>
 </tr>
 `;
 }
}
// ================= CORREÇÃO DA RENDERIZAÇÃO =================
const renderizarTabelaOriginal =
 renderizarTabela;
renderizarTabela = function(){
 renderizarTabelaOriginal();
 verificarListaVazia();
};
// ================= ATUALIZAÇÃO AUTOMÁTICA =================
window.addEventListener(
 "focus",
 ()=>{
 carregarVisitantes();
 }
);
// ================= TECLADO =================
document.addEventListener(
 "keydown",
 (evento)=>{
 if(
 evento.key === "Escape"
 ){
 $("#modalVisitante")
 ?.classList
 .add("is-hidden");
 }
 }
);
