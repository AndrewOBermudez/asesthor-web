// src/components/MapComponent.jsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet"; // Import useMap
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const customIcon = new L.Icon({
  iconUrl: "/assets/marker-icon.png",
  iconRetinaUrl: "/assets/marker-icon-2x.png",
  shadowUrl: "/assets/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MarkerCluster = ({ markers, onViewPhotos }) => {
  const map = useMap(); // Now useMap is available here

  useEffect(() => {
    if (!map) return;

    const markerCluster = L.markerClusterGroup();

    markers.forEach((ubicacion) => {
      const marker = L.marker([ubicacion.latitud, ubicacion.longitud], { icon: customIcon })
        .bindPopup(
          `<div style="text-align:center;">
            <h3>${ubicacion.nombre}</h3>
            <p><strong>Concesionario:</strong> ${ubicacion.concesionario}</p>
            ${ubicacion.url ? `<img src="${ubicacion.url}" alt="${ubicacion.nombre}" style="width:100px;height:100px;object-fit:cover;" />` : `<p>No hay foto disponible.</p>`}
            <button id="viewPhotosButton">Ver Todas las Fotos</button>
          </div>`
        );

      marker.on('popupopen', () => {
        const button = document.getElementById("viewPhotosButton");
        if (button) {
          button.onclick = () => {
            onViewPhotos([ubicacion], ubicacion.nombre, ubicacion.concesionario);
          };
        }
      });

      markerCluster.addLayer(marker);
    });

    map.addLayer(markerCluster);

    return () => {
      map.removeLayer(markerCluster);
    };
  }, [markers, map, onViewPhotos]);

  return null;
};

const MapComponent = ({ data, onViewPhotos }) => {
  return (
    <MapContainer center={[4.0715195, -76.2024221]} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MarkerCluster markers={data} onViewPhotos={onViewPhotos} />
    </MapContainer>
  );
};

export default MapComponent;
