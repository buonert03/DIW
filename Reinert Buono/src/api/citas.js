import axios from "axios";

const API_URL = "http://localhost:3000/api/citas";

export async function obterCitas(dni) {
  const respuesta = await axios.get(`${API_URL}/${encodeURIComponent(dni)}`);
  return respuesta.data;
}

export async function gardarCita(cita) {
  const respuesta = await axios.post(API_URL, cita);
  return respuesta.data;
}

export async function actualizarCita(id, cita) {
  const respuesta = await axios.put(`${API_URL}/${encodeURIComponent(id)}`, cita);
  return respuesta.data;
}

export async function borrarCita(id) {
  const respuesta = await axios.delete(`${API_URL}/${encodeURIComponent(id)}`);
  return respuesta.data;
}
