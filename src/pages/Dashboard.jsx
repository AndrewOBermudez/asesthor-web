// src/pages/Dashboard.jsx
import React, { act, useEffect, useState } from "react";
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { addDoc, collection, Timestamp} from "firebase/firestore";
import { db } from "../firebaseConfig"; 
import dayjs from 'dayjs';
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [actividades, setActividades] = useState([]);
  const [fotosModalOpen, setFotosModalOpen] = useState(false);
  const [fotosParaMostrar, setFotosParaMostrar] = useState({
    fotos: [],
    nombre: "",
    concesionario: "",
  });
  const [selectedExecutiveId, setSelectedExecutiveId] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // Estado para la fecha seleccionada
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const [openTestModal, setOpenTestModal] = useState(false);
  const [testData, setTestData] = useState({
    ejecutivoId: "",
    fullName: "",
    concesionario: "",
    descripcion: "",
    correccion: 0,
    creditosACargar: 0,
    creditosListos: 0,
    numeroDesembolsos: 0,
    fecha: dayjs(),
    zone: user?.zone || "",
    fotos: [{
      latitud: "",
      longitud: "",
      url: "",
      timestamp: dayjs(),
    }],
  });

  const handleOpenTestModal = () => setOpenTestModal(true);
  const handleCloseTestModal = () => setOpenTestModal(false);

  const handleTestInputChange = (e) => {
    const { name, value } = e.target;
    setTestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestDateChange = (date) => {
    setTestData((prev) => ({
      ...prev,
      fecha: date,
    }));
  };

  const handleFotoChange = (e) => {
    const { name, value } = e.target;
    setTestData((prev) => ({
      ...prev,
      fotos: [{
        ...prev.fotos[0],
        [name]: value,
      }],
    }));
  };

  const handleFotoDateChange = (date) => {
    setTestData((prev) => ({
      ...prev,
      fotos: [{
        ...prev.fotos[0],
        timestamp: date,
      }],
    }));
  };

  const handleAddTestData = async () => {
    try {
      const actividad = {
        ejecutivoId: testData.ejecutivoId,
        fullName: testData.fullName,
        concesionario: testData.concesionario,
        descripcion: testData.descripcion,
        correccion: Number(testData.correccion),
        creditosACargar: Number(testData.creditosACargar),
        creditosListos: Number(testData.creditosListos),
        numeroDesembolsos: Number(testData.numeroDesembolsos),
        fecha: Timestamp.fromDate(
          testData.fecha && testData.fecha.toDate
            ? testData.fecha.toDate()
            : new Date(testData.fecha)
        ),
        zone: testData.zone || user?.zone || "",
        fotos: [
          {
            latitud: Number(testData.fotos[0].latitud),
            longitud: Number(testData.fotos[0].longitud),
            url: testData.fotos[0].url,
            timestamp: Timestamp.fromDate(
              testData.fotos[0].timestamp && testData.fotos[0].timestamp.toDate
                ? testData.fotos[0].timestamp.toDate()
                : new Date(testData.fotos[0].timestamp)
            ),
          },
        ],
        ubicacion: {
          latitud: Number(testData.fotos[0].latitud),
          longitud: Number(testData.fotos[0].longitud),
        },
      };

      //console.log("Actividad a guardar:", actividad);

      await addDoc(collection(db, "actividades_ejecutivo"), actividad);
      setOpenTestModal(false);
      if (!user?.zone) {
        setLoading(true);
        try{
          const data = await getActividadesEjecutivo(user.zone);
          setActividades(data);
        }catch(err){
          console.error("Error al recargar actividades:", err);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error al agregar datos de prueba:", error);
      alert("Error al agregar datos de prueba");
    }
  };

  useEffect(() => {
    if (!user || !user.zone) return;
    const fetchActividades = async () => {
      setLoading(true);
      //console.log("Usuario completo:", user);
      console.log("Zona del usuario:", user?.zone);
      try {
        const data = await getActividadesEjecutivo(user.zone);
        setActividades(data);
        console.log("Datos recibidos de Firestore:", data);
      } catch (error) {
        console.error("Error al obtener actividades:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActividades();
  }, [user?.zone]);
  

  useEffect(() => {
    setTestData((prev) => ({
      ...prev,
      zone: user?.zone || "",
    }));
  }, [user?.zone]);

  

  // Filtrar actividades por zona del jefe
  let actividadesFiltradas = [...actividades];

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
      actividades
        .filter(a => a.ejecutivoId && a.fullName)
        .map((actividad) => [
          actividad.ejecutivoId,
          {id: actividad.ejecutivoId, nombre: actividad.fullName, concesionario: actividad.concesionario || ""},
        ])
    ).values()
  );
  console.log("Actividades:", actividades);
  console.log("Ejecutivos para el selector:", ejecutivos);

  // Procesar datos para los gráficos según la selección
  const datosCreditos = actividadesFiltradas.map((actividad) => ({
    label: `${dayjs(actividad.fecha).format('YYYY-MM-DD')} - ${actividad.fullName}`,
    creditosACargar: actividad.creditosACargar,
    creditosListos: actividad.creditosListos,
  }));
  

  const datosDesembolsos = actividadesFiltradas.map((actividad) => ({
    fecha: actividad.fecha && actividad.fecha.toDate?actividad.fecha.toDate().toLocaleDateString(): new Date(actividad.fecha).toLocaleDateString(),
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
      id: `${actividad.ejecutivoId}-${foto.timestamp && foto.timestamp.toDate?foto.timestamp.toDate().toISOString():new Date(foto.timestamp).toISOString}-${index}`, // Clave única combinando ejecutivoId, timestamp e índice
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

  if (loading) return <div>Cargando...</div>;

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
      <Button
        onClick={handleOpenTestModal}
        variant="contained"
        color="success"
        style={{ marginLeft: 10 }}
      >
        Agregar datos de prueba
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
            {ejecutivos.length === 0 ? (
              <MenuItem disabled>No hay ejecutivos</MenuItem>
            ) : (
              ejecutivos.map((ejecutivo) => (
                <MenuItem key={ejecutivo.id} value={ejecutivo.id}>
                  {ejecutivo.nombre}
                </MenuItem>
              ))
            )}
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

        { /* Botón para ver todas las fotos georreferenciadas */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleViewPhotos(ubicaciones, "Todas las Fotos", "Todos los Concesionarios")}
          style={{ marginLeft: '20px' }}
        >
          Ver todas las Fotos Georreferenciadas
        </Button>  
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
      <Dialog open={openTestModal} onClose={handleCloseTestModal}>
      <DialogTitle>Agregar datos de prueba</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="ID Ejecutivo"
          name="ejecutivoId"
          value={testData.ejecutivoId}
          onChange={handleTestInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Nombre Ejecutivo"
          name="fullName"
          value={testData.fullName}
          onChange={handleTestInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Concesionario"
          name="concesionario"
          value={testData.concesionario}
          onChange={handleTestInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Descripción"
          name="descripcion"
          value={testData.descripcion}
          onChange={handleTestInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Corrección"
          name="correccion"
          type="number"
          value={testData.correccion}
          onChange={handleTestInputChange}
          fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Fecha"
            value={testData.fecha}
            onChange={handleTestDateChange}
            renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
          />
        </LocalizationProvider>
        <TextField
          margin="dense"
          label="Créditos a Cargar"
          name="creditosACargar"
          type="number"
          value={testData.creditosACargar}
          onChange={handleTestInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Créditos Listos"
          name="creditosListos"
          type="number"
          value={testData.creditosListos}
          onChange={handleTestInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Número de Desembolsos"
          name="numeroDesembolsos"
          type="number"
          value={testData.numeroDesembolsos}
          onChange={handleTestInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Latitud Foto"
          name="latitud"
          type="number"
          value={testData.fotos[0].latitud}
          onChange={handleFotoChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Longitud Foto"
          name="longitud"
          type="number"
          value={testData.fotos[0].longitud}
          onChange={handleFotoChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="URL Foto"
          name="url"
          value={testData.fotos[0].url}
          onChange={handleFotoChange}
          fullWidth
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Fecha Foto"
            value={testData.fotos[0].timestamp}
            onChange={handleFotoDateChange}
            renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
          />
        </LocalizationProvider>
        <TextField
          margin="dense"
          label="Zona"
          name="zone"
          value={testData.zone || user?.zone || ""}
          onChange={handleTestInputChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseTestModal}>Cancelar</Button>
        <Button onClick={handleAddTestData} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>

    </div>
  );
};

export default Dashboard;
