function obterCookie(nome) {

    const cookies = document.cookie.split(";");


    for (const cookie of cookies) {

        const [chave, valor] =
        cookie.trim().split("=");


        if (chave === nome) {

            return valor;

        }

    }


    return null;

}





const WHATSAPP_URL =
"https://wa.me/5562992301358?text=Olá,%20vim%20pelo%20anúncio.";





// ===============================
// IDENTIFICADORES
// ===============================


let visitanteId =
localStorage.getItem("visitante_id");


let sessaoId =
localStorage.getItem("sessao_id");




if(!sessaoId){

    sessaoId =
    crypto.randomUUID();


    localStorage.setItem(
        "sessao_id",
        sessaoId
    );

}



if(!visitanteId){

    visitanteId =
    crypto.randomUUID();


    localStorage.setItem(
        "visitante_id",
        visitanteId
    );

}





// ===============================
// PARAMETROS URL
// ===============================


const params =
new URLSearchParams(
    window.location.search
);






// ===============================
// DADOS DA VISITA
// ===============================


const visita = {


    visitante_id:
    visitanteId,


    sessao_id:
    sessaoId,


    fbclid:
    params.get("fbclid"),



    fbp:
    obterCookie("_fbp"),



    fbc:

    obterCookie("_fbc") ||

    (
        params.get("fbclid")
        ?

        "fb.1." +
        Date.now() +
        "." +
        params.get("fbclid")

        :

        null
    ),



    utm_source:
    params.get("utm_source"),



    utm_medium:
    params.get("utm_medium"),



    utm_campaign:
    params.get("utm_campaign"),



    utm_content:
    params.get("utm_content"),



    utm_term:
    params.get("utm_term"),



    url:
    window.location.href,



    user_agent:
    navigator.userAgent,



    idioma:
    navigator.language,



    screen_width:
    window.screen.width,



    screen_height:
    window.screen.height,



    timezone:
    Intl.DateTimeFormat()
    .resolvedOptions()
    .timeZone,



    platform:
    navigator.platform,



    referrer:
    document.referrer,



    timestamp_cliente:
    new Date().toISOString(),



    status:
    "novo"


};







// ===============================
// ENVIA VISITA
// ===============================


fetch("/tracker", {


    method:"POST",


    headers:{


        "Content-Type":
        "application/json"


    },


    body:
    JSON.stringify(visita)



})



.then(async(res)=>{


    if(!res.ok){

    const erroServidor = await res.json();

    console.error(
        "Erro vindo do backend:",
        erroServidor
    );

    throw new Error(
        erroServidor.erro || "Erro ao enviar visita"
    );

}


    return res.json();


})



.then((dados)=>{


    console.log(
        "Tracker respondeu:",
        dados
    );



    const whatsapp =

    dados.whatsapp ||

    WHATSAPP_URL;




    const modoTeste =

    window.location.search.includes("teste");



    console.log(
        "Modo teste:",
        modoTeste
    );





    if(modoTeste){


        console.log(
            "🚧 TESTE - WhatsApp bloqueado:",
            whatsapp
        );


        return;


    }




    window.location.href =
    whatsapp;



})



.catch((erro)=>{


    console.error(
        "Erro tracker:",
        erro
    );


    console.log(
        "Nenhum redirecionamento executado por segurança"
    );


});