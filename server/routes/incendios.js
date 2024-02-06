const express = require("express");
const router = express.Router();

const {
  ObtenerAlertas,
  AlertasIncendios,
  ObtenerDepartamentos,
  AlertasDeslizamientos,
} = require("../controllers/incendios");

router.route("/incendios").get(AlertasIncendios);
router.route("/departamentos").get(ObtenerDepartamentos);
router.route("/deslizamientos").get(AlertasDeslizamientos);

module.exports = router;
