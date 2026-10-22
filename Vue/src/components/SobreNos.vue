<template>
  <div class="sobre-nos">
    <section class="intro">
      <h1>Sobre Nosotros</h1>
      <p>
        Sanidad Teis nace en 2020 con el objetivo de ofrecer una atención sanitaria
        moderna, cercana y digitalizada para los vecinos del barrio de Teis y
        alrededores.
      </p>
    </section>

    <section class="mision">
      <h2>Nuestra misión</h2>
      <p>
        Facilitar el acceso a la atención médica mediante herramientas digitales
        que simplifican la gestión de historiales, citas y comunicación entre
        pacientes y profesionales sanitarios.
      </p>
    </section>

    <section class="valores">
      <h2>Nuestros valores</h2>
      <ul>
        <li><strong>Cercanía:</strong> atención personalizada, adaptada a cada paciente.</li>
        <li><strong>Innovación:</strong> uso de tecnología para mejorar la experiencia sanitaria.</li>
        <li><strong>Confidencialidad:</strong> máxima protección de los datos personales.</li>
      </ul>
    </section>

    <section class="equipo">
      <h2>Nuestro equipo</h2>
      <div class="miembro">
        <h3>Dra. Marta Iglesias Rodríguez</h3>
        <p>Directora médica — Medicina General</p>
      </div>
      <div class="miembro">
        <h3>Dr. Alejandro Souto Pérez</h3>
        <p>Pediatría</p>
      </div>
      <div class="miembro">
        <h3>Lucía Fernández Vázquez</h3>
        <p>Administración y atención al paciente</p>
      </div>
    </section>
  </div>
</template>

<script setup>

</script>

<style scoped>
.sobre-nos {
  width: min(1000px, 100%);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4.5rem) clamp(1rem, 4vw, 3rem);
  box-sizing: border-box;
}

.intro,
.mision,
.valores,
.equipo {
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(29, 59, 44, 0.08);
}

.intro {
  margin-bottom: 1.25rem;
  text-align: center;
}

.intro h1 {
  margin: 0 0 1rem;
  color: var(--text-h);
  font-size: clamp(2rem, 5vw, 3.4rem);
}

.intro p,
.mision p,
.valores,
.miembro p {
  line-height: 1.7;
}

.mision,
.valores {
  display: inline-block;
  width: calc(50% - 0.75rem);
  box-sizing: border-box;
  vertical-align: top;
}

.mision {
  margin-right: 1.25rem;
}

.sobre-nos h2 {
  margin-top: 0;
  color: var(--text-h);
}

.valores ul {
  margin: 0;
  padding-left: 1.25rem;
}

.valores li + li {
  margin-top: 0.65rem;
}

.valores strong {
  color: var(--accent-dark);
}

.equipo {
  margin-top: 1.25rem;
}

.miembro {
  display: inline-block;
  width: calc(33.333% - 0.85rem);
  margin-right: 1rem;
  padding: 1.25rem;
  box-sizing: border-box;
  background: var(--surface-muted);
  border-left: 4px solid var(--accent);
  border-radius: 8px;
  vertical-align: top;
}

.miembro:last-child {
  margin-right: 0;
}

.miembro h3 {
  margin: 0 0 0.5rem;
  color: var(--text-h);
  font-size: 1.05rem;
}

@media (max-width: 768px) {
  .mision,
  .valores,
  .miembro {
    display: block;
    width: 100%;
    margin: 0 0 1.25rem;
  }

  .equipo .miembro:last-child {
    margin-bottom: 0;
  }
}

</style>