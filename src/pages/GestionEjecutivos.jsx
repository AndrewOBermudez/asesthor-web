// src/pages/GestionEjecutivos.jsx
import React, { useEffect, useState } from "react";
import { getActividadesEjecutivo, addEjecutivo, updateEjecutivo, deleteEjecutivo, addEjecutivoFoto } from "../services/firestoreService";
import EjecutivoForm from "../components/EjecutivoForm";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography } from "@mui/material";
import { Delete, Edit, Photo } from "@mui/icons-material";
import ActividadesTable from "../components/ActividadesTable"; // Reutiliza este componente para mostrar ejecutivos
import ExportCSVButton from "../components/ExportCSVButton"; // Importar el botón de exportación
import FotosModal from "../components/FotosModal";

const GestionEjecutivos = () => {
  const [ejecutivos, setEjecutivos] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentEjecutivo, setCurrentEjecutivo] = useState(null);
  const [fotosModalOpen, setFotosModalOpen] = useState(false);
  const [fotosParaMostrar, setFotosParaMostrar] = useState([]);

  useEffect(() => {
    const fetchEjecutivos = async () => {
      try {
        const data = await getActividadesEjecutivo();
        setEjecutivos(data);
      } catch (error) {
        console.error("Error al obtener ejecutivos:", error);
      }
    };
    fetchEjecutivos();
  }, []);

  const handleAdd = () => {
    setCurrentEjecutivo(null);
    setOpen(true);
  };

  const handleEdit = (ejecutivo) => {
    setCurrentEjecutivo(ejecutivo);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteEjecutivo(id);
      setEjecutivos(ejecutivos.filter((ej) => ej.id !== id));
    } catch (error) {
      console.error("Error al eliminar ejecutivo:", error);
    }
  };

  const handleSubmit = async (data) => {
    if (currentEjecutivo) {
      // Actualizar
      try {
        await updateEjecutivo(currentEjecutivo.id, data);
        setEjecutivos(
          ejecutivos.map((ej) =>
            ej.id === currentEjecutivo.id ? { ...ej, ...data } : ej
          )
        );
        setOpen(false);
      } catch (error) {
        console.error("Error al actualizar ejecutivo:", error);
      }
    } else {
      // Añadir
      try {
        const id = await addEjecutivo(data);
        setEjecutivos([...ejecutivos, { id, ...data }]);
        setOpen(false);
      } catch (error) {
        console.error("Error al añadir ejecutivo:", error);
      }
    }
  };

  // Función para manejar la visualización de fotos
  const handleViewPhotos = (fotos) => {
    setFotosParaMostrar(fotos);
    setFotosModalOpen(true);
  };

  return (
    <div className="gestion-ejecutivos-container">
      <h1>Gestión de Ejecutivos</h1>
      <Button variant="contained" color="primary" onClick={handleAdd} style={{ marginRight: "10px" }}>
        Añadir Ejecutivo
      </Button>
      <ExportCSVButton data={ejecutivos} filename="ejecutivos.csv" />

      <ActividadesTable
        data={ejecutivos}
        actions
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewPhotos={handleViewPhotos}
      />

      {/* Diálogo para Añadir o Editar Ejecutivos */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{currentEjecutivo ? "Editar Ejecutivo" : "Añadir Ejecutivo"}</DialogTitle>
        <DialogContent>
          <EjecutivoForm onSubmit={handleSubmit} initialData={currentEjecutivo} />
          {/* Opcional: Añadir funcionalidades adicionales aquí si es necesario */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Componente Modal para Fotos */}
      <FotosModal
        open={fotosModalOpen}
        handleClose={() => setFotosModalOpen(false)}
        fotos={fotosParaMostrar}
      />
    </div>
  );
};

export default GestionEjecutivos;
