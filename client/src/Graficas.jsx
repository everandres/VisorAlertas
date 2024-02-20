import React, { useContext, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  DoughnutController,
  Tooltip,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { DataContext } from "./DataContext";

// Registro de elementos y controladores necesarios
Chart.register(
  ArcElement,
  DoughnutController,
  Tooltip,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement
);

const GraficasDeslizamientosIncendios = () => {
  const { incendiosData, deslizamientosData } = useContext(DataContext);
  const [mostrarIncendios, setMostrarIncendios] = useState(true);

  const prepararDatosGrafica = (datos) => {
    const agrupadosPorRegion = datos.reduce((acc, item) => {
      acc[item.REGION] = (acc[item.REGION] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(agrupadosPorRegion),
      datasets: [
        {
          data: Object.values(agrupadosPorRegion),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#cc65fe",
            "#ff6348",
            "#36a2eb",
            "#cc65fe",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#cc65fe",
            "#ff6348",
            "#36a2eb",
            "#cc65fe",
          ],
        },
      ],
    };
  };

  const prepararDatosGraficaProbabilidades = (datos) => {
    const conteoProbabilidades = datos.reduce((acc, { PROBABILIDAD }) => {
      acc[PROBABILIDAD] = (acc[PROBABILIDAD] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: ["Probabilidad 1", "Probabilidad 2", "Probabilidad 3"],
      datasets: [
        {
          label: "Número de Eventos por Probabilidad",
          data: [
            conteoProbabilidades["1"],
            conteoProbabilidades["2"],
            conteoProbabilidades["3"],
          ],
          backgroundColor: ["#FFFF00", "#FFA500", "#FF0000"], // Amarillo, Naranja, Rojo
        },
      ],
    };
  };

  const datosActuales = mostrarIncendios ? incendiosData : deslizamientosData;
  const datosGrafica = prepararDatosGrafica(datosActuales);
  const datosGraficaProbabilidades =
    prepararDatosGraficaProbabilidades(datosActuales);
  const totalMunicipios = datosGrafica.datasets[0].data.reduce(
    (acc, curr) => acc + curr,
    0
  );

  const renderizarTotalesPorRegion = () => {
    return datosGrafica.labels.map((label, index) => (
      <div key={label}>
        {label}: {datosGrafica.datasets[0].data[index]} municipios
      </div>
    ));
  };

  const prepararDatosTablaProbabilidades = (datos, probabilidad) => {
    const agrupadosPorDepartamento = datos.reduce((acc, item) => {
      if (item.PROBABILIDAD === probabilidad) {
        acc[item.DEPARTAMENTO] = (acc[item.DEPARTAMENTO] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(agrupadosPorDepartamento).sort((a, b) => b[1] - a[1]);
  };

  const renderizarTablaPorProbabilidad = (datosTabla) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Departamento</th>
            <th>Cantidad de municipios</th>
          </tr>
        </thead>
        <tbody>
          {datosTabla.map(([departamento, cantidad]) => (
            <tr key={departamento}>
              <td>{departamento}</td>
              <td>{cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        gap: "20px",
      }}
    >
      <div style={{ flex: 1, flexDirection: "column" }}>
        <button onClick={() => setMostrarIncendios(!mostrarIncendios)}>
          Mostrar {mostrarIncendios ? "Deslizamientos" : "Incendios"}
        </button>
        {mostrarIncendios ? (
          <>
            <h2>Incendios por Región</h2>
            <Doughnut data={datosGrafica} />
          </>
        ) : (
          <>
            <h2>Deslizamientos por Región</h2>
            <Doughnut data={datosGrafica} />
          </>
        )}
        <div style={{ marginTop: "20px" }}>
          <h3>Total de municipios: {totalMunicipios}</h3>
          {renderizarTotalesPorRegion()}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h2>Total de Eventos por Probabilidad</h2>
        <Bar data={datosGraficaProbabilidades} />
        {/* Tablas por probabilidad */}
        <div>
          <h2>Total de Municipios por Probabilidad</h2>
          <h3>Probabilidad 1</h3>
          {renderizarTablaPorProbabilidad(
            prepararDatosTablaProbabilidades(datosActuales, "1")
          )}
          <h3>Probabilidad 2</h3>
          {renderizarTablaPorProbabilidad(
            prepararDatosTablaProbabilidades(datosActuales, "2")
          )}
          <h3>Probabilidad 3</h3>
          {renderizarTablaPorProbabilidad(
            prepararDatosTablaProbabilidades(datosActuales, "3")
          )}
        </div>
      </div>
    </div>
  );
};

export default GraficasDeslizamientosIncendios;
