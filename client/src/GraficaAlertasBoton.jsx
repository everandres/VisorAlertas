import React from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const GraficaAlertas = ({ buttonUrl }) => {
  const map = useMap();

  React.useEffect(() => {
    const graficaAlertasControl = L.control({ position: "topleft" });

    graficaAlertasControl.onAdd = function () {
      const button = L.DomUtil.create(
        "button",
        "leaflet-bar leaflet-control leaflet-control-custom"
      );
      
      // Estilos base
      button.style.backgroundColor = "white";
      button.style.width = "40px";
      button.style.height = "40px";
      button.style.border = "3px solid rgba(185,255,237,0.2)";
      button.style.cursor = "pointer";
      button.style.position = "relative"; // Para la sombra y el efecto hover
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      
      // Sombra y efecto hover
      button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
      button.onmouseover = () => {
        button.style.backgroundColor = "#f0f0f0"; // Cambia al pasar el mouse
        button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
      };
      button.onmouseout = () => {
        button.style.backgroundColor = "white";
        button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
      };

      // Ícono y tooltip
      button.innerHTML = '<i class="fa fa-chart-bar" style="color: #333;"></i>'; // Ícono con color inicial
      button.title = "Ver gráficas de alertas";

      // Cambiar el color del ícono en hover
      button.onmouseover = () => {
        button.firstChild.style.color = "#007bff"; // Cambia el color del ícono al pasar el mouse
      };
      button.onmouseout = () => {
        button.firstChild.style.color = "#333"; // Vuelve al color original
      };

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

  return null;
};

export default GraficaAlertas;
