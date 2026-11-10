import { defineStore } from 'pinia'

// Mantén dispoñible a selección de doctor entre compoñentes.
export const useDoctorStore = defineStore('doctor', {
  state: () => ({
    doctores: [],
    iddoc: null,
    nomedoc: null,
    apeldoc: null,
  }),

  actions: {
    // Copia ao estado os datos identificativos do doutor seleccionado.
    seleccionarDoctor(doctor) {
      this.iddoc = doctor.iddoc;
      this.nomedoc = doctor.nomedoc;
      this.apeldoc = doctor.apeldoc;
    },
    // Borra os datos identificativos da selección actual.
    limpiarDoctor() {
      this.iddoc = null;
      this.nomedoc = null;
      this.apeldoc = null;
    },
  },
})
