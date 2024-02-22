import React from "react";
import { GeoJSON } from "react-leaflet";

const estiloDepartamentos = {
  weight: 0.6, // Define el grosor de la línea del límite
  opacity: 0.8, // Define la opacidad de la línea del límite
  color: "black", // Define el color de la línea del límite
  fill: false, // Indica que el interior del polígono no debe ser rellenado
};

const CapaDepartamentos = ({ departamentos, estilo }) => {
  return departamentos.map((departamento, index) => (
    <GeoJSON
      key={index}
      data={departamento.geom}
      style={estiloDepartamentos}
      pane="departamentosPane"
      // Aquí puedes agregar eventos como onEachFeature si necesitas interactividad
    />
  ));
};

export default CapaDepartamentos;
