import { defineStore } from "pinia";

const TOKEN_KEY = "sanidad-teis-token";
const DNI_KEY = "sanidad-teis-dni";

// Mantiene los datos de sesión en Pinia y los recupera del almacenamiento del navegador.
export const useSesionStore = defineStore("sesion", {
  state: () => ({
    token: typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
    dnipac: typeof localStorage !== "undefined" ? localStorage.getItem(DNI_KEY) : null,
  }),

  actions: {
    // Actualiza el estado reactivo y persiste las credenciales para próximas visitas.
    gardarSesion({ token, dnipac }) {
      this.token = token;
      this.dnipac = dnipac;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(DNI_KEY, dnipac);
    },

    // Borra tanto el estado en memoria como los datos persistidos.
    pecharSesion() {
      this.token = null;
      this.dnipac = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(DNI_KEY);
    },
  },
});
