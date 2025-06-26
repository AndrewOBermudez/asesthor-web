// src/components/FotosModal.jsx
import React from "react";
import { Modal, Box, Typography, ImageList, ImageListItem } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
};

const FotosModal = ({ open, handleClose, fotos, nombre, concesionario }) => {
  console.log("Fotos recibidas en el Modal:", fotos); // Log para depuración

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="fotos-modal-title"
      aria-describedby="fotos-modal-description"
    >
      <Box sx={style}>
        <Typography id="fotos-modal-title" variant="h6" component="h2" gutterBottom>
          Fotos de {nombre}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Concesionario: {concesionario}
        </Typography>
        {fotos && fotos.length > 0 ? (
          <ImageList variant="masonry" cols={3} gap={8}>
            {fotos.map((foto, index) => {
              if (!foto) {
                console.error(`Foto en el índice ${index} es undefined.`);
                return null;
              }

              return (
                <ImageListItem key={index}>
                  <img
                    src={foto.url}
                    alt={`Foto ${index + 1}`}
                    loading="lazy"
                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                  />
                  <Typography variant="caption" display="block" gutterBottom>
                    {foto.timestamp instanceof Date ? foto.timestamp.toLocaleString() : "Timestamp inválido"}
                  </Typography>
                </ImageListItem>
              );
            })}
          </ImageList>
        ) : (
          <Typography>No hay fotos disponibles.</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default FotosModal;
