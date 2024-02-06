const mongoose = require("mongoose");

const NewSchema = new mongoose.Schema({
  REGION: { type: String, required: true },
  DEPARTAMENTO: { type: String, required: true },
  MUNICIPIO: { type: String, required: true },
  COD_DANE: { type: Number, required: true },
  PROBABILIDAD: { type: String, required: true },
  FECHA_EJECUCION: { type: String, required: true },
  geometry: { type: Object, required: true },
});

module.exports = mongoose.model("incendios", NewSchema);
