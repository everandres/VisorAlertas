const mongoose = require("mongoose");
const { Pool } = require("pg");
require("dotenv").config();

const conexion = (url) => {
  return mongoose.connect(url);
};

//Conexion por postgresql

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

module.exports = { conexion, pool };
