const PIXEL_ID = process.env.META_PIXEL_ID;

const ACCESS_TOKEN =
process.env.META_ACCESS_TOKEN.trim();



async function enviarEventoMeta(evento) {


const url =
`https://graph.facebook.com/v23.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;



const payload = {

data:[

{

event_name:"Lead",

event_time:
Math.floor(Date.now()/1000),


event_id:
evento.event_id,


event_source_url:
evento.url,


action_source:
"website",


user_data:{


fbp:
evento.fbp,


fbc:
evento.fbc,


client_user_agent:
evento.user_agent,


client_ip_address:
evento.ip

}


}

]

};



const resposta =
await fetch(
url,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:
JSON.stringify(payload)

});



const resultado =
await resposta.json();



if(!resposta.ok){

throw new Error(
JSON.stringify(resultado)
);

}



return resultado;


}



module.exports={
enviarEventoMeta
};