import React, { useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import { DataContext } from "./DataContext"; // Importa el contexto

// Importaciones necesarias para Chart.js versión 3 o superior
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registro de componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const DataIncendios = () => {
  // Desestructura incendiosData, incendiosError y incendiosLoading de DataContext
  const {
    incendiosData,
    isLoading: incendiosLoading,
    error: incendiosError,
  } = useContext(DataContext);
  const [regionSeleccionada, setRegionSeleccionada] = useState(null);
  const [datosGrafica, setDatosGrafica] = useState(null);

  if (incendiosLoading) {
    return (
      <div className="App">
        <h1>Cargando...</h1>
      </div>
    );
  }

  if (incendiosError) {
    return (
      <div className="App">
        <h1>Error: {incendiosError.message}</h1>
      </div>
    );
  }

  // Utiliza incendiosData en lugar de data
  const regionesUnicas = Array.from(
    new Set(incendiosData.map((incendio) => incendio.REGION))
  );

  const mostrarDepartamentos = (region) => {
    setRegionSeleccionada(region);
    setDatosGrafica(null);
  };

  const mostrarGrafica = (departamento) => {
    // Actualizado para usar incendiosData
    const incendios = incendiosData.filter(
      (incendio) => incendio.DEPARTAMENTO === departamento
    );
    const probabilidades = {
      baja: incendios.filter((i) => Number(i.PROBABILIDAD) === 1).length,
      moderada: incendios.filter((i) => Number(i.PROBABILIDAD) === 2).length,
      alta: incendios.filter((i) => Number(i.PROBABILIDAD) === 3).length,
    };

    setDatosGrafica({
      labels: ["Baja", "Moderada", "Alta"],
      datasets: [
        {
          label: "Probabilidad de Incendios",
          data: [
            probabilidades.baja,
            probabilidades.moderada,
            probabilidades.alta,
          ],
          backgroundColor: ["yellow", "orange", "red"],
        },
      ],
    });
  };

  const resetearSeleccion = () => {
    setRegionSeleccionada(null);
    setDatosGrafica(null);
  };

  // Actualizado para usar incendiosData
  const listaRegiones = regionesUnicas.map((region, index) => (
    <div
      key={index}
      className="tarjeta-region"
      onClick={() => mostrarDepartamentos(region)}
    >
      <p>{region}</p>
    </div>
  ));

  // Actualizado para usar incendiosData
  const departamentosPorRegion = regionSeleccionada
    ? Object.entries(
        incendiosData
          .filter((incendio) => incendio.REGION === regionSeleccionada)
          .reduce((contador, incendio) => {
            contador[incendio.DEPARTAMENTO] =
              (contador[incendio.DEPARTAMENTO] || 0) + 1;
            return contador;
          }, {})
      ).map(([departamento, cantidad], index) => (
        <div
          key={index}
          className="tarjeta-departamento"
          onClick={() => mostrarGrafica(departamento)}
        >
          <p>
            {departamento} ({cantidad})
          </p>
        </div>
      ))
    : null;

  return (
    <div className="App">
      <div>{listaRegiones}</div>
      {regionSeleccionada && (
        <button onClick={resetearSeleccion}>Resetear Selección</button>
      )}
      <div className="departamentos">{departamentosPorRegion}</div>
      {datosGrafica && (
        <div className="grafica">
          <Bar data={datosGrafica} />
        </div>
      )}
    </div>
  );
};
