const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();


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
require("../routes/tracker");

const dashboard =
require("../routes/dashboard");

const visitantes =
require("../routes/visitantes");

const conversoes =
require("../routes/conversoes");

const eventos =
require("../routes/eventos");


// =======================
// ATIVAÇÃO DAS ROTAS
// =======================

app.use("/", tracker);

app.use("/", dashboard);

app.use("/", visitantes);

app.use("/api/conversoes", conversoes);

app.use("/api/eventos", eventos);


// =======================
// EXPORTAÇÃO VERCEL
// =======================

module.exports = app;