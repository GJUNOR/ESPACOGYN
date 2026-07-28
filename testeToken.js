require("dotenv").config();

async function teste(){

    const token = process.env.META_ACCESS_TOKEN.trim();

    const resposta = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${token}`
    );

    const dados = await resposta.json();

    console.log(dados);

}

teste();