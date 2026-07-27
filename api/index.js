const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();


// =======================
// MIDDLEWARES
// =======================

app.use(cors());

app.use(express.json());


// =======================
// PUBLIC
// =======================

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);



// =======================
// ROTA PRINCIPAL
// =======================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../public/index.html"
        )
    );

});




// =======================
// ROTAS ATLAS
// =======================

const tracker =
require("../routes/tracker");

const dashboard =
require("../routes/dashboard");

const visitantes =
require("../routes/visitantes");

const conversoes =
require("../routes/conversoes");

const eventos =
require("../routes/eventos");


app.use("/", tracker);

app.use("/", dashboard);

app.use("/", visitantes);

app.use("/api/conversoes", conversoes);

app.use("/api/eventos", eventos);



// =======================
// EXPORT VERCEL
// =======================

module.exports = app;