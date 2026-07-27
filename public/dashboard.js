'use strict';
// ================= CONFIG =================
const API_URL = "/api/dashboard";
const REFRESH_INTERVAL = 30000;
// ================= HELPERS =================
const $ = (selector) => document.querySelector(selector);
// ================= ELEMENTOS =================
const elVisitantes = $("#totalVisitantes");
const elVisitas = $("#totalVisitas");
const elConversoes = $("#totalConversoes");
const loadingGlobal = $("#loadingGlobal");
const toastContainer = $("#toastContainer");
// ================= ESTADO =================
let dashboardData = {};
let graficoVisitas = null;
let graficoDispositivos = null;
// ================= FORMATADORES =================
function formatarNumero(valor){
 return Number(valor || 0)
 .toLocaleString("pt-BR");
}
function formatarData(data){
 if(!data) return "-";
 return new Date(data)
 .toLocaleString("pt-BR");
}
// ================= LOADER =================
function mostrarLoader(){
 loadingGlobal?.classList.remove("is-hidden");
}
function esconderLoader(){
 loadingGlobal?.classList.add("is-hidden");
}
// ================= TOAST =================
function mostrarToast(titulo, mensagem, tipo="success"){
 if(!toastContainer) return;
 const toast = document.createElement("div");
 toast.className = `toast ${tipo}`;
 toast.innerHTML = `
 <strong>${titulo}</strong>
 <p>${mensagem}</p>
 `;
 toastContainer.appendChild(toast);
 setTimeout(()=>{
 toast.remove();
 },4000);
}
// ================= INICIALIZAÇÃO =================
document.addEventListener("DOMContentLoaded",()=>{
 carregarDashboard();
 setInterval(()=>{
 carregarDashboard();
 }, REFRESH_INTERVAL);
});
async function buscarDashboard(){
 const resposta = await fetch(API_URL,{
 method:"GET",
 headers:{
 "Accept":"application/json"
 }
 });
 if(!resposta.ok){
 throw new Error(
 `Erro na API: ${resposta.status}`
 );
 }
 return await resposta.json();
}
// ================= CARREGAMENTO =================
async function carregarDashboard(){
 try{
 mostrarLoader();
 dashboardData = await buscarDashboard();
 atualizarKPIs(dashboardData);
 atualizarCampanhas(dashboardData);
 atualizarOrigens(dashboardData);
 atualizarNavegadores(dashboardData);
 atualizarSistemas(dashboardData);
 atualizarDispositivos(dashboardData);
 atualizarTabelaVisitas(dashboardData);
 atualizarGraficoVisitas(dashboardData);
 atualizarGraficoDispositivos(dashboardData);
 esconderLoader();
 }catch(erro){
 esconderLoader();
 console.error(
 "Erro carregando dashboard:",
 erro
 );
 mostrarToast(
 "Erro",
 erro.message,
 "danger"
 );
 }
}
// ================= FILTROS =================
const btnFiltrar = $("#btnFiltrar");
btnFiltrar?.addEventListener(
 "click",
 ()=>{
 carregarDashboard();
 }
);
function atualizarKPIs(dados){
 if(!dados) return;
 $("#totalVisitantes").textContent =
 formatarNumero(dados.visitantes);
 $("#totalVisitas").textContent =
 formatarNumero(dados.visitas);
 $("#totalConversoes").textContent =
 formatarNumero(dados.conversoes);
 $("#novosVisitantes").textContent =
 formatarNumero(dados.visitantes);
 $("#visitantesRetorno").textContent =
 formatarNumero(
 dados.visitas - dados.visitantes
 );
 $("#convHoje").textContent =
 formatarNumero(dados.conversoes);
 $("#totalCampanhas").textContent =
 dados.campanhas?.length || 0;
}
// ================= CAMPANHAS =================
function atualizarCampanhas(dados){
 const lista = $("#listaCampanhas");
 if(!lista) return;
 lista.innerHTML = "";
 (dados.campanhas || []).forEach(item=>{
 lista.innerHTML += `
 <div class="campaign-card">
 <div class="campaign-name">
 ${item.campanha}
 </div>
 <div class="campaign-meta">
 <span>
 Campanha
 </span>
 <span>
 ${item.quantidade} visitantes
 </span>
 </div>
 <div class="progress">
 <div class="progress-bar"
 style="width:${item.quantidade * 10}%">
 </div>
 </div>
 </div>
 `;
 });
}
// ================= ORIGENS =================
function atualizarOrigens(dados){
 const lista=$("#listaOrigens");
 if(!lista) return;
 lista.innerHTML="";
 (dados.origens || []).forEach(item=>{
 lista.innerHTML += `
 <div class="source-item">
 <span>
 ${item.origem}
 </span>
 <div class="source-bar">
 <div class="source-fill"
 style="width:${item.quantidade * 10}%">
 </div>
 </div>
 <strong>
 ${item.quantidade}
 </strong>
 </div>
 `;
 });
}
// ================= LISTAS =================
function renderizarLista(id, dados, campo){
 const lista=$(id);
 if(!lista) return;
 lista.innerHTML="";
 (dados || []).forEach(item=>{
 lista.innerHTML += `
 <div class="list-item">
 <span>
 ${item[campo]}
 </span>
 <strong>
 ${item.quantidade}
 </strong>
 </div>
 `;
 });
}
function atualizarNavegadores(dados){
 renderizarLista(
 "#listaNavegadores",
 dados.navegadores,
 "navegador"
 );
}
function atualizarSistemas(dados){
 renderizarLista(
 "#listaSistemas",
 dados.sistemas,
 "sistema"
 );
}
function atualizarDispositivos(dados){
 renderizarLista(
 "#listaDispositivos",
 dados.dispositivos,
 "dispositivo"
 );
}
function atualizarTabelaVisitas(dados){
 const tbody = $("#tabelaUltimasVisitas");
 if(!tbody) return;
 tbody.innerHTML = "";
 (dados.ultimasVisitas || []).forEach(item=>{
 tbody.innerHTML += `
 <tr>
 <td>
 ${formatarData(item.criado_em)}
 </td>
 <td>
 ${item.visitante_id || "-"}
 </td>
 <td>
 ${item.utm_campaign || "Sem campanha"}
 </td>
 <td>
 ${item.utm_source || "Direto"}
 </td>
 <td>
 ${item.navegador || "-"}
 </td>
 <td>
 ${item.dispositivo || "-"}
 </td>
 <td>
 <span class="badge">
 ${item.status || "novo"}
 </span>
 </td>
 </tr>
 `;
 });
}
// ================= GRÁFICO VISITAS =================
function gerarDadosGrafico(dados){
 const agrupado = {};
 (dados.ultimasVisitas || []).forEach(item=>{
 const dia = new Date(item.criado_em)
 .toLocaleDateString("pt-BR");
 agrupado[dia] = (agrupado[dia] || 0) + 1;
 });
 return {
 labels:Object.keys(agrupado),
 valores:Object.values(agrupado)
 };
}
function atualizarGraficoVisitas(dados){
 const canvas =
 document.getElementById("graficoVisitas");
 if(!canvas) return;
 const resultado =
 gerarDadosGrafico(dados);
 if(graficoVisitas){
 graficoVisitas.destroy();
 }
 graficoVisitas = new Chart(canvas,{
 type:"line",
 data:{
 labels:resultado.labels,
 datasets:[{
 label:"Visitas",
 data:resultado.valores,
 tension:0.3
 }]
 },
 options:{
 responsive:true,
 maintainAspectRatio:false
 }
 });
}
// ================= GRÁFICO DISPOSITIVOS =================
function atualizarGraficoDispositivos(dados){
 const canvas =
 document.getElementById("graficoDispositivos");
 if(!canvas) return;
 if(graficoDispositivos){
 graficoDispositivos.destroy();
 }
 graficoDispositivos = new Chart(canvas,{
 type:"doughnut",
 data:{
 labels:
 dados.dispositivos.map(
 item=>item.dispositivo
 ),
 datasets:[{
 data:
 dados.dispositivos.map(
 item=>item.quantidade
 )
 }]
 },
 options:{
 responsive:true,
 maintainAspectRatio:false
 }
 });
}
window.addEventListener("focus",()=>{
 carregarDashboard();
});
// ================= CONEXÃO =================
window.addEventListener("online",()=>{
 mostrarToast(
 "Conexão",
 "Internet restabelecida.",
 "success"
 );
 carregarDashboard();
});
window.addEventListener("offline",()=>{
 mostrarToast(
 "Sem conexão",
 "Você está offline.",
 "warning"
 );
});
// ================= LIMPEZA =================
function destruirGraficos(){
 if(graficoVisitas){
 graficoVisitas.destroy();
 graficoVisitas = null;
 }
 if(graficoDispositivos){
 graficoDispositivos.destroy();
 graficoDispositivos = null;
 }
}
window.addEventListener(
 "beforeunload",
 ()=>{
 destruirGraficos();
 dashboardData = {};
 }
);
