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
import "./DashboardStyles.css";

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
            "#c3cdbf",
            "#79b254",
            "#55834a",
            "#486233",
            "#8cae7b",
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
      labels: ["Alerta Amarrilla", "Alerta Naranja", "Alerta Roja"],
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

  const fechaEjecucion = mostrarIncendios
    ? incendiosData[0]?.FECHA_EJECUCION // Utiliza el operador opcional para evitar errores si el array está vacío
    : deslizamientosData[0]?.FECHA_EJECUCION;

  const renderizarTablaPorProbabilidad = (datosTabla, probabilidad) => {
    const totalCantidad = datosTabla.reduce(
      (acc, [, cantidad]) => acc + cantidad,
      0
    );
    const probabilidadClase = `tabla-contenedor probabilidad-${probabilidad}`;

    return (
      <div className={probabilidadClase}>
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
            {/* Fila de total */}
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td>{totalCantidad}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const opcionesDona = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "rgb(0, 0, 0)",
          font: {
            size: 14,
          },
          filter: function (item, chart) {
            return item.text !== "";
          },
        },
      },
      title: {
        display: true,
        text: "Distribución por Regiones",
        font: {
          size: 20,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
  };

  return (
    <div className="dashboard">
      <h1 className="titulo-general">
        Alertas Vigentes Por Pronóstico de la Amenaza De{" "}
        {mostrarIncendios
          ? "Incendios de la Cobertura Vegetal"
          : "Deslizamientos de tierra"}
      </h1>
      <h4 className="fecha-ejecucion">Fecha de ejecución: {fechaEjecucion}</h4>

      <div className="columna-izquierda">
        <button
          className="boton-cambio"
          onClick={() => setMostrarIncendios(!mostrarIncendios)}
        >
          {mostrarIncendios ? "Deslizamientos" : "Incendios"}
        </button>
        <div className="contenedor-grafica">
          <Doughnut data={datosGrafica} options={opcionesDona} />
          <h1>Total municipios: {totalMunicipios}</h1>
          <div className="contenedor-totales">
            {renderizarTotalesPorRegion()}
          </div>
        </div>
      </div>
      <div className="columna-derecha">
        <div className="contenedor-grafica-barras">
          <Bar
            data={datosGraficaProbabilidades}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Cantidad de alertas",
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: "rgb(0, 0, 0)",
                    font: {
                      size: 14,
                    },
                    // Función para filtrar la leyenda y ocultar la que tiene la etiqueta vacía
                    filter: function (item, chart) {
                      // Retorna verdadero para mostrar la etiqueta, falso para ocultarla
                      return item.text !== "";
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div className="contenedor-tablas">
          {renderizarTablaPorProbabilidad(
            prepararDatosTablaProbabilidades(datosActuales, "1"),
            "1" // Pasa este argumento para la probabilidad 1
          )}
          {renderizarTablaPorProbabilidad(
            prepararDatosTablaProbabilidades(datosActuales, "2"),
            "2" // Pasa este argumento para la probabilidad 2
          )}
          {renderizarTablaPorProbabilidad(
            prepararDatosTablaProbabilidades(datosActuales, "3"),
            "3" // Pasa este argumento para la probabilidad 3
          )}
        </div>
      </div>
    </div>
  );
};

export default GraficasDeslizamientosIncendios;
