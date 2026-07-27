const express = require("express");
const path = require("path");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

// Página
router.get("/dashboard", (req,res)=>{

    res.sendFile(path.join(__dirname,"../public/dashboard.html"));

});

// API
router.get("/api/dashboard", dashboardController.dashboard);

module.exports = router;