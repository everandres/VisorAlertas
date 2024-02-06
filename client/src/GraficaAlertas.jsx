// Archivo GraficaAlertas.js

import React from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const GraficaAlertas = ({ buttonUrl }) => {
  const map = useMap(); // Hook para acceder al objeto del mapa

  React.useEffect(() => {
    const graficaAlertasControl = L.control({ position: "topleft" }); // Ajusta la posición según necesites

    graficaAlertasControl.onAdd = function () {
      const button = L.DomUtil.create(
        "button",
        "leaflet-bar leaflet-control leaflet-control-custom"
      );
      button.style.backgroundColor = "white";

      button.style.width = "30px";
      button.style.height = "30px";
      button.style.border = "2px solid rgba(0,0,0,0.2)";
      button.style.cursor = "pointer";
      button.innerHTML = '<i class="fa fa-chart-bar"></i>'; // Puedes usar un ícono o texto
      button.title = "Ver gráficas de alertas"; // Tooltip al pasar el mouse

      button.onclick = function () {
        window.open(buttonUrl, "_blank");
      };

      return button;
    };

    graficaAlertasControl.addTo(map);

    return () => {
      map.removeControl(graficaAlertasControl);
    };
  }, [map, buttonUrl]);

  return null; // Este componente no renderiza nada directamente
};

export default GraficaAlertas;
