<template>
  <main class="servicios-medicos">
    <header class="cabecera">
      <h1>Servicios Médicos</h1>
      <p>Atención sanitaria para acompañarte en cada etapa de tu salud.</p>
    </header>

    <section class="lista-servicios" aria-label="Servicios médicos">
      <article v-for="servicio in servicios" :key="servicio.nombre" class="servicio">
        <h2>{{ servicio.nombre }}</h2>
        <p>{{ servicio.descripcion }}</p>
      </article>
    </section>
  </main>
</template>

<script setup>
const servicios = [
  {
    nombre: "Medicina general",
    descripcion: "Consultas de atención primaria, prevención y seguimiento de la salud.",
  },
  {
    nombre: "Pediatría",
    descripcion: "Atención y seguimiento médico para bebés, niños y adolescentes.",
  },
  {
    nombre: "Enfermería",
    descripcion: "Cuidados, curas, vacunación y orientación para el autocuidado.",
  },
  {
    nombre: "Urgencias",
    descripcion: "Valoración y atención de problemas de salud que requieren asistencia rápida.",
  },
  {
    nombre: "Diagnóstico por imagen",
    descripcion: "Pruebas de imagen para apoyar la valoración y el diagnóstico médico.",
  },
  {
    nombre: "Análisis clínicos",
    descripcion: "Pruebas de laboratorio solicitadas por los profesionales sanitarios.",
  },
];
</script>

<style scoped>
.servicios-medicos {
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4.5rem) clamp(1rem, 4vw, 3rem);
  box-sizing: border-box;
}

.cabecera {
  margin-bottom: 1.5rem;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow);
}

.cabecera h1 {
  margin: 0 0 0.75rem;
  color: var(--text-h);
  font-size: clamp(2rem, 5vw, 3.2rem);
}

.cabecera p {
  margin-bottom: 0;
  line-height: 1.6;
}

.lista-servicios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
}

.servicio {
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent);
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(29, 59, 44, 0.08);
}

.servicio h2 {
  margin: 0 0 0.75rem;
  color: var(--text-h);
  font-size: 1.2rem;
}

.servicio p {
  margin: 0;
  line-height: 1.6;
}
</style>
