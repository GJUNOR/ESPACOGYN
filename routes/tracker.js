const express = require("express");
const router = express.Router();

const trackerController =
    require("../controllers/trackerController");


router.post(
    "/tracker",
    trackerController.registrarVisita
);


module.exports = router;