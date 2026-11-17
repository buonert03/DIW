import { defineStore } from 'pinia'

// Comparte la selección actual del doctor entre las vistas mediante Pinia.
export const useDoctorStore = defineStore('doctor', {
  state: () => ({
    doctores: [],
    iddoc: null,
    nomedoc: null,
    apeldoc: null,
  }),

  actions: {
    // Copia al estado global los datos que identifican al doctor seleccionado.
    seleccionarDoctor(doctor) {
      this.iddoc = doctor.iddoc;
      this.nomedoc = doctor.nomedoc;
      this.apeldoc = doctor.apeldoc;
    },
    // Limpia la selección cuando deja de haber un doctor activo.
    limpiarDoctor() {
      this.iddoc = null;
      this.nomedoc = null;
      this.apeldoc = null;
    },
  },
})
