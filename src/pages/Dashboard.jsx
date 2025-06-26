// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import BarChartComponent from "../components/BarChartComponent";
import LineChartComponent from "../components/LineChartComponent";
import PieChartComponent from "../components/PieChartComponent";
import MapComponent from "../components/MapComponent";
import FotosModal from "../components/FotosModal";
import { getActividadesEjecutivo } from "../services/firestoreService";
import { Button, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import "./Dashboard.css";

const Dashboard = () => {
  const { logout, user } = useAuth(); // 'user' contiene información del jefe, incluyendo su zona
  const [actividades, setActividades] = useState([]);
  const [fotosModalOpen, setFotosModalOpen] = useState(false);
  const [fotosParaMostrar, setFotosParaMostrar] = useState({
    fotos: [],
    nombre: "",
    concesionario: "",
  });
  const [selectedExecutiveId, setSelectedExecutiveId] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // Estado para la fecha seleccionada

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const data = await getActividadesEjecutivo();
        setActividades(data);
      } catch (error) {
        console.error("Error al obtener actividades:", error);
      }
    };
    fetchActividades();
  }, []);

  // Obtener la zona del jefe
  const bossZone = user?.zone; // Asegúrate de que el objeto 'user' tiene el campo 'zone'

  // Filtrar actividades por zona del jefe
  let actividadesFiltradas = actividades.filter(
    (actividad) => actividad.zone === bossZone
  );

  // Filtrar por ejecutivo seleccionado
  if (selectedExecutiveId) {
    actividadesFiltradas = actividadesFiltradas.filter(
      (actividad) => actividad.ejecutivoId === selectedExecutiveId
    );
  }

  // Filtrar por fecha seleccionada
  if (selectedDate) {
    const fechaSeleccionada = dayjs(selectedDate).startOf('day');
    actividadesFiltradas = actividadesFiltradas.filter((actividad) =>
      dayjs(actividad.fecha).isSame(fechaSeleccionada, 'day')
    );
  }

  // Obtener lista de ejecutivos únicos en la zona
  const ejecutivos = Array.from(
    new Map(
      actividadesFiltradas.map((actividad) => [
        actividad.ejecutivoId,
        { id: actividad.ejecutivoId, nombre: actividad.fullName, concesionario: actividad.concesionario },
      ])
    ).values()
  );

  // Procesar datos para los gráficos según la selección
  const datosCreditos = actividadesFiltradas.map((actividad) => ({
    label: `${dayjs(actividad.fecha).format('YYYY-MM-DD')} - ${actividad.fullName}`,
    creditosACargar: actividad.creditosACargar,
    creditosListos: actividad.creditosListos,
  }));
  

  const datosDesembolsos = actividadesFiltradas.map((actividad) => ({
    fecha: actividad.fecha.toLocaleDateString(),
    numeroDesembolsos: actividad.numeroDesembolsos,
  }));

  const datosPie = [
    {
      name: "Créditos a Cargar",
      value: actividadesFiltradas.reduce(
        (acc, curr) => acc + curr.creditosACargar,
        0
      ),
    },
    {
      name: "Créditos Listos",
      value: actividadesFiltradas.reduce(
        (acc, curr) => acc + curr.creditosListos,
        0
      ),
    },
  ];

  // Aplanar todas las fotos de todas las actividades seleccionadas
  const ubicaciones = actividadesFiltradas.flatMap((actividad) => {
    return actividad.fotos.map((foto, index) => ({
      id: `${actividad.ejecutivoId}-${foto.timestamp.toISOString()}-${index}`, // Clave única combinando ejecutivoId, timestamp e índice
      nombre: actividad.fullName,
      concesionario: actividad.concesionario || "N/A",
      latitud: foto.latitud,
      longitud: foto.longitud,
      url: foto.url,
      timestamp: foto.timestamp, // Asegúrate de que es un objeto Date
    }));
  });

  // Función para manejar la visualización de fotos
  const handleViewPhotos = (fotos, nombre, concesionario) => {
    if (!fotos || !Array.isArray(fotos)) {
      console.error("Las fotos no están definidas o no son un array.");
      return;
    }
    setFotosParaMostrar({ fotos, nombre, concesionario });
    setFotosModalOpen(true);
  };

  // Función para manejar el cambio en la selección del ejecutivo
  const handleExecutiveChange = (event) => {
    setSelectedExecutiveId(event.target.value);
  };

  // Función para manejar el cambio en la selección de fecha
  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  return (
    <div className="dashboard-container">
      <h1>Bienvenido al Dashboard</h1>
      {user && user.email && (
        <div style={{ marginBottom: '10px', color: '#555', fontWeight: 'bold' }}>
          Usuario: {user.email}
        </div>
      )}
      <Button
        onClick={handleLogout}
        variant="contained"
        color="secondary"
        className="logout-button"
      >
        Cerrar Sesión
      </Button>

      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
        {/* Desplegable de Ejecutivos */}
        <FormControl variant="outlined" style={{ minWidth: 200, marginRight: '20px' }}>
          <InputLabel id="executive-select-label">Seleccionar Ejecutivo</InputLabel>
          <Select
            labelId="executive-select-label"
            id="executive-select"
            value={selectedExecutiveId}
            onChange={handleExecutiveChange}
            label="Seleccionar Ejecutivo"
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {ejecutivos.map((ejecutivo) => (
              <MenuItem key={ejecutivo.id} value={ejecutivo.id}>
                {ejecutivo.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Selector de Fecha */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Seleccionar Fecha"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} variant="outlined" />}
          />
        </LocalizationProvider>
      </div>

      <section className="charts-section">
        <div className="chart-item">
          <h2>Créditos por Ejecutivo</h2>
          <BarChartComponent data={datosCreditos} />
        </div>

        <div className="chart-item">
          <h2>Número de Desembolsos a lo Largo del Tiempo</h2>
          <LineChartComponent data={datosDesembolsos} />
        </div>

        <div className="chart-item">
          <h2>Distribución de Créditos</h2>
          <PieChartComponent data={datosPie} />
        </div>
      </section>

      <section className="map-section">
        <h2>Ubicación de Ejecutivos</h2>
        <MapComponent
          data={ubicaciones}
          onViewPhotos={(fotos, nombre, concesionario) => {
            handleViewPhotos(fotos, nombre, concesionario);
          }}
        />
      </section>

      {/* Componente Modal para Fotos */}
      <FotosModal
        open={fotosModalOpen}
        handleClose={() => setFotosModalOpen(false)}
        fotos={fotosParaMostrar.fotos}
        nombre={fotosParaMostrar.nombre}
        concesionario={fotosParaMostrar.concesionario}
      />
    </div>
  );
};

export default Dashboard;
