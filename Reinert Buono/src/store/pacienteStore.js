import { defineStore } from 'pinia'

// Mantén dispoñible a selección de paciente entre compoñentes.
export const usePacienteStore = defineStore('paciente', {
  state: () => ({
    pacientes: [],
    dnipac: null,
    nomepac: null,
    apelpac: null,
  }),

  actions: {
    // Copia ao estado os datos de identificación do rexistro seleccionado.
    seleccionarPaciente(paciente) {
      this.dnipac = paciente.dnipac;
      this.nomepac = paciente.nomepac;
      this.apelpac = paciente.apelpac;
    },
    // Borra os datos de identificación da selección actual.
    limpiarPaciente() {
      this.dnipac = null;
      this.nomepac = null;
      this.apelpac = null;
    },
  },
})
