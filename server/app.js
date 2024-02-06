const express = require("express");
const { conexion, pool } = require("./database/conexion");
const cors = require("cors");
require("dotenv").config();
const incendios = require("./routes/incendios");

app = express();

app.use(cors());

app.use(express.json());
app.use("/api/v1", incendios);

app.listen(8000, () => {
  console.log("Servidor escuchando");
});
