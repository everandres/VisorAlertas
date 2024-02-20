import React from "react";
import { Routes, Route } from "react-router-dom";
import { VistaIncendios } from "./VistaIncendios";
import { DataIncendios } from "./Datos";
import GraficasDeslizamientosIncendios from "./Graficas";

export const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<VistaIncendios />} />
        <Route path="/graficas" element={<GraficasDeslizamientosIncendios />} />
        {/* Puedes añadir más rutas según sea necesario */}
      </Routes>
    </div>
  );
};
