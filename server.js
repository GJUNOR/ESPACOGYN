require("dotenv").config();


const express = require("express");
const cors = require("cors");


const app = express();

const PORT =
    process.env.PORT || 3000;



// =======================
// MIDDLEWARES
// =======================

app.use(cors());

app.use(express.json());

app.use(express.static("public"));




// =======================
// ROTAS
// =======================

const tracker =
    require("./routes/tracker");

const dashboard =
    require("./routes/dashboard");

const visitantes =
    require("./routes/visitantes");

const conversoes =
    require("./routes/conversoes");

const eventos =
    require("./routes/eventos");




// =======================
// ATIVAÇÃO DAS ROTAS
// =======================

app.use("/", tracker);

app.use("/", dashboard);

app.use("/", visitantes);

app.use("/api/conversoes", conversoes);

app.use("/api/eventos", eventos);




// =======================
// SERVIDOR
// =======================

app.listen(PORT, () => {


    console.log("======================================");

    console.log("🚀 ATLAS TRACKER");

    console.log(
        `Servidor rodando em http://localhost:${PORT}`
    );

    console.log("======================================");


});