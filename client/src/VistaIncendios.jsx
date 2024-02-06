import React, { useContext } from "react";
import { DataContext } from "./DataContext";
import { MapaIncendios } from "./MapaIncendios";

export const VistaIncendios = () => {
  const { incendiosData, departamentosData, deslizamientosData } =
    useContext(DataContext);

  return (
    <div className="App">
      <MapaIncendios
        incendios={incendiosData}
        departamentos={departamentosData}
        deslizamientos={deslizamientosData} // Pasar los datos de deslizamientos al componente
      />
    </div>
  );
};
