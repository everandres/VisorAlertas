const Incendios = require("../models/incendios");
const { pool, conexion_postgres } = require("../database/conexion");

const ObtenerAlertas = async (req, res) => {
  try {
    const icv = await Incendios.find({});
    res.status(200).json({ icv });
  } catch (err) {
    res.status(500).json({ status: "failed", msg: err });
  }
};

const AlertasIncendios = async (req, res) => {
  try {
    // Realiza la consulta a la base de datos
    const result = await pool.query("SELECT * FROM public.alertas_incendios");
    // Envía los resultados como JSON
    res.status(200).json(result.rows);
  } catch (err) {
    // Maneja cualquier error que ocurra durante la consulta
    res.status(500).json({ status: "failed", msg: err.message });
  }
};

const ObtenerDepartamentos = async (req, res) => {
  try {
    // Realiza la consulta a la base de datos
    const result = await pool.query(
      "SELECT * FROM public.departamentos_colombia"
    );
    // Envía los resultados como JSON
    res.status(200).json(result.rows);
  } catch (err) {
    // Maneja cualquier error que ocurra durante la consulta
    res.status(500).json({ status: "failed", msg: err.message });
  }
};

const AlertasDeslizamientos = async (req, res) => {
  try {
    // Realiza la consulta a la base de datos
    const result = await pool.query(
      "SELECT * FROM public.alertas_deslizamientos"
    );
    // Envía los resultados como JSON
    res.status(200).json(result.rows);
  } catch (err) {
    // Maneja cualquier error que ocurra durante la consulta
    res.status(500).json({ status: "failed", msg: err.message });
  }
};

module.exports = {
  ObtenerAlertas,
  AlertasIncendios,
  ObtenerDepartamentos,
  AlertasDeslizamientos,
};
