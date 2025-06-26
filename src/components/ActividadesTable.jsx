// src/components/ActividadesTable.jsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete, Edit, Photo } from "@mui/icons-material";

const ActividadesTable = ({ data, actions, onEdit, onDelete, onViewPhotos }) => {
  return (
    <TableContainer component={Paper} style={{ marginTop: "20px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Créditos a Cargar</TableCell>
            <TableCell>Créditos Listos</TableCell>
            <TableCell>Número de Desembolsos</TableCell>
            <TableCell>Fotos</TableCell>
            {actions && <TableCell>Acciones</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((actividad) => (
            <TableRow key={actividad.id}>
              <TableCell>{actividad.fecha.toLocaleString()}</TableCell>
              <TableCell>{actividad.descripcion}</TableCell>
              <TableCell>{actividad.creditosACargar}</TableCell>
              <TableCell>{actividad.creditosListos}</TableCell>
              <TableCell>{actividad.numeroDesembolsos}</TableCell>
              <TableCell>
                {actividad.fotos && actividad.fotos.length > 0 ? (
                  <Tooltip title="Ver Fotos">
                    <IconButton onClick={() => onViewPhotos(actividad.fotos)}>
                      <Photo />
                    </IconButton>
                  </Tooltip>
                ) : (
                  "Sin Fotos"
                )}
              </TableCell>
              {actions && (
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(actividad)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => onDelete(actividad.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActividadesTable;
