<template>
  <div class="inicio">
    <section class="hero">
      <h1>Bienvenido a Sanidad Teis</h1>
      <p class="subtitulo">Tu centro de salud de confianza en el barrio de Teis</p>
      <p>
        En Sanidad Teis ofrecemos atención médica cercana, profesional y accesible
        para toda la familia. Contamos con un equipo comprometido con tu bienestar
        y con las últimas herramientas digitales para facilitar la gestión de tus
        datos y citas.
      </p>
    </section>

    <section class="accesos-rapidos">
      <div class="tarjeta">
        <h2>Gestión de Pacientes</h2>
        <p>Consulta, registra o modifica tus datos médicos.</p>
        <router-link to="/xestion-pacientes">Acceder</router-link>
      </div>
      <div class="tarjeta">
        <h2>Sobre Nosotros</h2>
        <p>Conoce nuestro equipo y nuestra misión.</p>
        <router-link to="/sobrenos">Ver más</router-link>
      </div>
      <div class="tarjeta">
        <h2>Aviso Legal</h2>
        <p>Información sobre privacidad y condiciones de uso.</p>
        <router-link to="/avisolegal">Consultar</router-link>
      </div>
    </section>

    <section class="info-contacto">
      <h2>Información de contacto</h2>
      <ul>
        <li><strong>Horario:</strong> Lunes a Viernes, 8:00 - 20:00</li>
        <li><strong>Dirección:</strong> Rúa de Eduardo Cabello, 12, 36216 Vigo, Pontevedra</li>
        <li><strong>Teléfono:</strong> 986 45 12 30</li>
        <li><strong>Email:</strong> info@sanidadteis.gal</li>
      </ul>
    </section>
  </div>
</template>

<script setup>

</script>

<style scoped>
.inicio {
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4.5rem) clamp(1rem, 4vw, 3rem);
  box-sizing: border-box;
}

.hero {
  max-width: 760px;
  margin: 0 auto 2.5rem;
  padding: clamp(1.75rem, 4vw, 3.5rem);
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow);
}

.hero h1 {
  margin: 0 0 1rem;
  color: var(--text-h);
  font-size: clamp(2.1rem, 5vw, 3.8rem);
  line-height: 1.08;
}

.hero p {
  line-height: 1.7;
}

.hero .subtitulo {
  margin-bottom: 1rem;
  color: var(--accent-dark);
  font-size: 1.15rem;
  font-weight: 600;
}

.accesos-rapidos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.tarjeta,
.info-contacto {
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(29, 59, 44, 0.08);
}

.tarjeta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 185px;
}

.tarjeta h2,
.info-contacto h2 {
  margin-top: 0;
  color: var(--text-h);
}

.tarjeta p {
  flex: 1;
  line-height: 1.6;
}

.tarjeta a {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.65rem 1rem;
  color: white;
  background: var(--accent);
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
}

.tarjeta a:hover {
  background: var(--accent-dark);
}

/* a animación só para quen non desactivou o movemento no seu sistema */
@media (prefers-reduced-motion: no-preference) {
  .tarjeta a {
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .tarjeta a:hover {
    transform: translateY(-2px);
  }
}

.info-contacto {
  max-width: 720px;
  margin: 0 auto;
}

.info-contacto ul {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: 1.5;
}

.info-contacto strong {
  color: var(--text-h);
}

@media (max-width: 768px) {
  .accesos-rapidos,
  .info-contacto ul {
    grid-template-columns: 1fr;
  }
}

</style>