import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import { DataIncendios } from "./Datos.jsx";
import { DataProvider } from "./DataContext.jsx"; // Importa DataProvider
import { VistaIncendios } from "./VistaIncendios";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <DataProvider>
    {" "}
    {/* Envuelve los componentes con DataProvider */}
    <>
      <VistaIncendios />
    </>
  </DataProvider>
);
