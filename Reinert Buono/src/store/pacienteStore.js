import { defineStore } from 'pinia'

export const usePacienteStore = defineStore('paciente', {
  state: () => ({
        pacientes: [],
        dnipac: null,
        nomepac: null,
        apelpac: null,
  }),

  actions: {
    seleccionarPaciente(paciente) {
        this.dnipac = paciente.dnipac;
        this.nomepac = paciente.nomepac;
        this.apelpac = paciente.apelpac;
    },
    limpiarPaciente() {
        this.dnipac = null;
        this.nomepac = null;
        this.apelpac = null;
    },
  },
})
