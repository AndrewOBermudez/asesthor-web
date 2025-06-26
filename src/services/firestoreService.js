// src/services/firestoreService.js
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Funciones para interactuar con Firestore

/**
 * Obtener todas las actividades de ejecutivos
 * @returns {Promise<Array>} Lista de actividades
 */
export const getActividadesEjecutivo = async () => {
  const actividadesCol = collection(db, "actividades_ejecutivo");
  const actividadesSnapshot = await getDocs(actividadesCol);
  const actividadesList = actividadesSnapshot.docs.map((doc) => {
    const data = doc.data();
    const fotos = data.fotos
      ? data.fotos.map((foto) => ({
          ...foto,
          timestamp: foto.timestamp.toDate(), // Convertir Firestore Timestamp a Date
        }))
      : [];
    return {
      id: doc.id,
      ...data,
      fecha: data.fecha.toDate(), // Convertir Firestore Timestamp a Date
      fotos: fotos,
    };
  });
  return actividadesList;
};

/**
 * Añadir un nuevo ejecutivo
 * @param {Object} ejecutivoData Datos del ejecutivo
 * @returns {Promise<string>} ID del nuevo documento
 */
export const addEjecutivo = async (ejecutivoData) => {
  const actividadesCol = collection(db, "actividades_ejecutivo");
  const docRef = await addDoc(actividadesCol, {
    ...ejecutivoData,
    fecha: new Date(), // Añadir la fecha actual
    fotos: [], // Inicializar el array de fotos vacío
  });
  return docRef.id;
};

/**
 * Actualizar un ejecutivo existente
 * @param {string} id ID del ejecutivo
 * @param {Object} updatedData Datos actualizados
 * @returns {Promise<void>}
 */
export const updateEjecutivo = async (id, updatedData) => {
  const docRef = doc(db, "actividades_ejecutivo", id);
  await updateDoc(docRef, updatedData);
};

/**
 * Eliminar un ejecutivo
 * @param {string} id ID del ejecutivo
 * @returns {Promise<void>}
 */
export const deleteEjecutivo = async (id) => {
  const docRef = doc(db, "actividades_ejecutivo", id);
  await deleteDoc(docRef);
};

/**
 * Suscribirse a cambios en la colección de ejecutivos
 * @param {Function} callback Función a llamar con los datos actualizados
 * @returns {Function} Función para cancelar la suscripción
 */
export const subscribeToActividadesEjecutivo = (callback) => {
  const actividadesCol = collection(db, "actividades_ejecutivo");
  return onSnapshot(actividadesCol, (snapshot) => {
    const actividadesList = snapshot.docs.map((doc) => {
      const data = doc.data();
      const fotos = data.fotos
        ? data.fotos.map((foto) => ({
            ...foto,
            timestamp: foto.timestamp.toDate(),
          }))
        : [];
      return {
        id: doc.id,
        ...data,
        fecha: data.fecha.toDate(),
        fotos: fotos,
      };
    });
    callback(actividadesList);
  });
};

/**
 * Añadir una foto al array 'fotos' de un ejecutivo
 * @param {string} ejecutivoId ID del ejecutivo
 * @param {Object} fotoData Datos de la foto
 * @returns {Promise<void>}
 */
export const addEjecutivoFoto = async (ejecutivoId, fotoData) => {
  const docRef = doc(db, "actividades_ejecutivo", ejecutivoId);
  await updateDoc(docRef, {
    fotos: arrayUnion(fotoData),
  });
};
