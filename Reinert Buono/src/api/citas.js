import axios from "axios";

const API_URL = "http://localhost:3000/api/citas";

// Recupera las citas asociadas al DNI indicado.
export async function obterCitas(dni) {
  const respuesta = await axios.get(`${API_URL}/${encodeURIComponent(dni)}`);
  return respuesta.data;
}

// Envía una nueva cita y devuelve el documento creado por el servidor.
export async function gardarCita(cita) {
  const respuesta = await axios.post(API_URL, cita);
  return respuesta.data;
}

// Actualiza la cita indicada y devuelve su versión guardada.
export async function actualizarCita(id, cita) {
  const respuesta = await axios.put(`${API_URL}/${encodeURIComponent(id)}`, cita);
  return respuesta.data;
}

// Elimina una cita por su identificador.
export async function borrarCita(id) {
  const respuesta = await axios.delete(`${API_URL}/${encodeURIComponent(id)}`);
  return respuesta.data;
}
