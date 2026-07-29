const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();
const leads =
require("../routes/leads");


// =======================
// MIDDLEWARES
// =======================

app.use(cors());

app.use(express.json());

app.use("/", leads);

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

    res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Atlas Tracker</title>
        </head>
        <body>
            <h1>🚀 Atlas Tracker funcionando no Vercel</h1>
        </body>
        </html>
    `);

});




// =======================
// ROTAS ATLAS
// =======================

const tracker =
require("../routes/tracker");

const dashboard =
require("../routes/dashboard");

const leads =
require("../routes/leads");

const conversoes =
require("../routes/conversoes");

const eventos =
require("../routes/eventos");


app.use("/", tracker);

app.use("/", dashboard);

app.use("/", leads);

app.use("/api/conversoes", conversoes);

app.use("/api/eventos", eventos);



// =======================
// EXPORT VERCEL
// =======================

module.exports = app;