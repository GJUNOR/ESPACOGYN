// Captura os parâmetros da URL
const params = new URLSearchParams(window.location.search);
const dados = Object.fromEntries(params.entries());

// Mostra os parâmetros na tela
const resultado = document.createElement("pre");
resultado.textContent = JSON.stringify(dados, null, 2);
document.body.appendChild(resultado);

// Envia os dados para o servidor
fetch("/capturar", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
})
.then(res => res.json())
.then(resposta => {
    console.log("Resposta do servidor:", resposta);
})
.catch(erro => {
    console.error("Erro:", erro);
});