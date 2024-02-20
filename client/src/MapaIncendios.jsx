import React, { useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CapaDepartamentos from "./CapaDepartamentos"; // Importa el nuevo componente
import GraficaAlertas from "./GraficaAlertasBoton"; // Asegúrate de tener la ruta correcta al archivo
import MapSearchBar from "./MapSearchBar";

const MapTitle = ({ title, width = "auto", height = "auto" }) => {
  const map = useMap();
  React.useEffect(() => {
    const titleControl = L.control({ position: "bottomright" }); // Cambiamos la posición a 'bottomright'

    titleControl.onAdd = function () {
      const div = L.DomUtil.create("div");
      // Ajustamos el estilo para posicionar correctamente en la parte inferior derecha
      div.style.position = "absolute";
      div.style.bottom = "10px"; // Posicionamiento desde la parte inferior
      div.style.right = "10px"; // Posicionamiento desde la derecha
      div.style.zIndex = "400";
      div.style.backgroundColor = "rgba(247, 228, 182, 0.8)";
      div.style.padding = "5px 10px";
      div.style.borderRadius = "8px";
      div.style.fontSize = "12px";
      div.style.color = "#333";
      div.innerHTML = title;

      // Establece el ancho y el alto según las propiedades pasadas
      div.style.width = "300px";
      div.style.height = height;

      div.style.display = "flex";
      div.style.justifyContent = "center";
      div.style.alignItems = "center";

      return div;
    };

    titleControl.addTo(map);

    return () => {
      map.removeControl(titleControl);
    };
  }, [map, title]);

  return null;
};

const logoUrl =
  "https://storage.googleapis.com/efor-static/IDEAM/Smartkey/IDEA_smartkey_logo.png";

// Componente para añadir el logo
const MapLogo = ({ logoUrl }) => {
  const map = useMap(); // Hook para acceder al objeto del mapa

  React.useEffect(() => {
    const logoControl = L.control({ position: "bottomleft" }); // Crear el control con la posición deseada

    logoControl.onAdd = function () {
      const img = L.DomUtil.create("img");
      img.src = logoUrl;
      img.style.width = "100px"; // Ajusta esto según el tamaño de tu logo
      img.style.margin = "5px"; // Margen para evitar que el logo toque los bordes del mapa
      return img;
    };

    logoControl.addTo(map);

    // Opcional: Limpiar al desmontar
    return () => {
      map.removeControl(logoControl);
    };
  }, [map, logoUrl]);

  return null; // Este componente no renderiza nada directamente
};

// Componente ControlCheckbox
const ControlCheckbox = ({ label, initialState, onChange }) => {
  const map = useMap(); // Hook para acceder al objeto del mapa

  useState(() => {
    const controlDiv = L.DomUtil.create(
      "div",
      "leaflet-control checkbox-container"
    );
    controlDiv.style.padding = "6px";
    controlDiv.style.backgroundColor = "rgba(74,193,141,0.4)";
    controlDiv.style.border = "1px solid #ccc";
    controlDiv.style.borderRadius = "9px";
    controlDiv.style.boxShadow = "0 2px 4px rgba(169,245,245,0.8)"; // Sombra para dar efecto elevado
    controlDiv.style.transition = "box-shadow 0.2s, transform 0.2s"; // Transición suave para efecto

    const input = L.DomUtil.create("input", "", controlDiv);
    input.type = "checkbox";
    input.checked = initialState;
    input.onchange = onChange; // Función que se llama al cambiar el estado de la casilla
    input.style.marginRight = "5px";

    const labelElement = L.DomUtil.create("label", "", controlDiv);
    labelElement.appendChild(input);
    labelElement.append(label);
    labelElement.style.cursor = "pointer"; // Hace que el cursor sea un puntero para indicar que es clickeable

    L.DomEvent.disableClickPropagation(controlDiv);

    L.DomEvent.on(controlDiv, "mousedown", () => {
      controlDiv.style.boxShadow = "0 1px 2px rgba(0,0,0,0.2)"; // Sombra más pequeña para efecto hundido
      controlDiv.style.transform = "translateY(1px)"; // Mueve ligeramente hacia abajo
    });

    L.DomEvent.on(controlDiv, "mouseup", () => {
      controlDiv.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)"; // Restaura sombra original
      controlDiv.style.transform = "translateY(0)"; // Restaura posición original
    });

    const customControl = L.control({ position: "topright" });
    customControl.onAdd = () => controlDiv;
    customControl.addTo(map);

    return () => {
      map.removeControl(customControl);
      L.DomEvent.off(controlDiv, "mousedown");
      L.DomEvent.off(controlDiv, "mouseup");
    };
  }, [map, label, initialState, onChange]);

  return null; // Este componente no renderiza nada directamente
};

export const MapaIncendios = ({ incendios, departamentos, deslizamientos }) => {
  const centroMapa = [4.5709, -74.2973]; // Coordenadas centrales de Colombia
  const [mostrarIncendios, setMostrarIncendios] = useState(false);
  const [mostrarDeslizamientos, setMostrarDeslizamientos] = useState(true); // Nuevo estado

  const getColor = (probabilidad) => {
    const nivelProbabilidad = Number(probabilidad);
    switch (nivelProbabilidad) {
      case 1:
        return "yellow";
      case 2:
        return "orange";
      case 3:
        return "red";
      default:
        return "gray";
    }
  };

  const estilo = (feature) => ({
    fillColor: getColor(feature.properties.PROBABILIDAD),
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  });

  const handleMouseOverOut = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 5,
          color: "#84DFF1",
          fillOpacity: 0.7,
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }

        const popupContent = `Región: ${feature.properties.REGION}<br />
          Departamento: ${feature.properties.DEPARTAMENTO}<br />
          Probabilidad: ${feature.properties.PROBABILIDAD_DESC}<br />
          Municipio: ${feature.properties.MUNICIPIO}<br />
          Última actualización: ${feature.properties.FECHA_EJECUCION}`;

        layer.bindPopup(popupContent).openPopup();
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(estilo(feature)); // Restablece el estilo original
        layer.closePopup();
      },
    });
  };

  return (
    <MapContainer
      center={centroMapa}
      zoom={6}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GraficaAlertas buttonUrl="/graficas" />
      <MapLogo logoUrl={logoUrl} /> {/* Incluir el logo en el mapa */}
      <MapTitle title="Alertas Ambientales Vigentes - Oficina del Servicio de Pronósticos y Alertas" />
      <ControlCheckbox
        label="Mostrar Alertas Incendios"
        initialState={mostrarIncendios}
        onChange={(e) => setMostrarIncendios(e.target.checked)}
      />
      {mostrarIncendios &&
        incendios.map((incendio, index) => (
          <GeoJSON
            key={index}
            data={incendio.geom}
            style={estilo}
            onEachFeature={handleMouseOverOut}
          />
        ))}
      <ControlCheckbox
        label="Mostrar Alertas Deslizamientos"
        initialState={mostrarDeslizamientos}
        onChange={(e) => setMostrarDeslizamientos(e.target.checked)}
      />
      // Renderizar la capa de deslizamientos si mostrarDeslizamientos es true
      {mostrarDeslizamientos &&
        deslizamientos.map((deslizamiento, index) => (
          <GeoJSON
            key={index}
            data={deslizamiento.geom}
            style={estilo} // Asume que `estilo` es apropiado para deslizamientos o crea una función de estilo específica
            onEachFeature={handleMouseOverOut} // Asume que es adecuado para deslizamientos o crea un manejador específico
          />
        ))}
      <CapaDepartamentos departamentos={departamentos} />
    </MapContainer>
  );
};
