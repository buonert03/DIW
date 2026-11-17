import { defineStore } from 'pinia'

// Comparte la selección actual del paciente entre las vistas mediante Pinia.
export const usePacienteStore = defineStore('paciente', {
  state: () => ({
    pacientes: [],
    dnipac: null,
    nomepac: null,
    apelpac: null,
    pacienteSeleccionado: null,
  }),

  actions: {
    // Copia los datos identificativos y una instantánea del registro seleccionado.
    seleccionarPaciente(paciente) {
      this.dnipac = paciente.dnipac;
      this.nomepac = paciente.nomepac;
      this.apelpac = paciente.apelpac;
      this.pacienteSeleccionado = { ...paciente };
    },
    // Limpia la selección cuando deja de haber un paciente activo.
    limpiarPaciente() {
      this.dnipac = null;
      this.nomepac = null;
      this.apelpac = null;
      this.pacienteSeleccionado = null;
    },
  },
})
