import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-control-geocoder";

const MapSearchBar = () => {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: true,
      placeholder: "Buscar lugar...",
      errorMessage: "No se pudo encontrar",
      geocoder: new L.Control.Geocoder.Nominatim(),
    }).addTo(map);

    geocoder.on("markgeocode", function (e) {
      const bbox = e.geocode.bbox;
      const poly = L.polygon([
        bbox.getSouthEast(),
        bbox.getNorthEast(),
        bbox.getNorthWest(),
        bbox.getSouthWest(),
      ]).addTo(map);
      map.fitBounds(poly.getBounds());
    });

    return () => {
      map.removeControl(geocoder);
    };
  }, [map]);

  return null;
};

export default MapSearchBar;
