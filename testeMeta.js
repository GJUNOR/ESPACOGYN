require("dotenv").config();


async function teste(){

const token = process.env.META_ACCESS_TOKEN.trim();

const pixel = process.env.META_PIXEL_ID;


const resposta = await fetch(
`https://graph.facebook.com/v23.0/${pixel}/events?access_token=${token}`,
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

data:[

{

event_name:"Lead",

event_time:
Math.floor(Date.now()/1000),

event_id:
crypto.randomUUID(),

action_source:"website",


user_data:{

fbp:
"fb.1.1785177775734.553284981635784625",

fbc:
"fb.1.1785177775734.TESTE123",

client_user_agent:
"Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

}

}

]

})

});


console.log(
await resposta.json()
);


}


teste();