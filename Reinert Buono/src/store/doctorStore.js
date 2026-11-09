import { defineStore } from 'pinia'

export const useDoctorStore = defineStore('doctor', {
  state: () => ({
        doctores: [],
        dnipac: null,
        nomepac: null,
        apelpac: null,
  }),

  actions: {
    seleccionarDoctor(doctor) {
        this.dnipac = doctor.dnipac;
        this.nomepac = doctor.nomepac;
        this.apelpac = doctor.apelpac;
    },
    limpiarDoctor() {
        this.dnipac = null;
        this.nomepac = null;
        this.apelpac = null;
    },
  },
})
