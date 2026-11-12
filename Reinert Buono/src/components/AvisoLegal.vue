<template>
  <main class="aviso-legal">
    <header class="cabecera">
      <span class="etiqueta">SANIDAD TEIS</span>
      <h1>Aviso legal</h1>
      <p class="introduccion">
        Información sobre el uso de este sitio web y el alcance de sus contenidos.
      </p>
    </header>

    <div class="contenido">
      <section>
        <h2>Finalidad del sitio</h2>
        <p>
          Este sitio ofrece información general sobre Sanidad Teis y herramientas
          para la gestión de pacientes, profesionales y citas. Su contenido se
          proporciona con fines informativos y de demostración.
        </p>
      </section>

      <section>
        <h2>Uso adecuado</h2>
        <p>
          Las personas usuarias se comprometen a utilizar el sitio de forma
          responsable, conforme a la normativa aplicable y sin perjudicar su
          funcionamiento ni los derechos de otras personas.
        </p>
      </section>

      <section>
        <h2>Exactitud de la información</h2>
        <p>
          Se procura que la información publicada sea clara y esté actualizada.
          No obstante, puede contener errores u omisiones y no se garantiza que
          permanezca vigente en todo momento. La información de este sitio no
          sustituye la valoración ni las indicaciones de un profesional sanitario.
        </p>
      </section>

      <section>
        <h2>Enlaces a sitios de terceros</h2>
        <p>
          Este sitio puede incluir enlaces a páginas externas. Sanidad Teis no
          controla esos sitios ni es responsable de sus contenidos, disponibilidad
          o políticas. La inclusión de un enlace no implica necesariamente una
          recomendación ni una relación con sus responsables.
        </p>
      </section>

      <section>
        <h2>Disponibilidad y cambios</h2>
        <p>
          El sitio puede modificarse, interrumpirse o dejar de estar disponible
          temporalmente por tareas de mantenimiento u otras circunstancias.
          También se podrá actualizar este aviso cuando resulte necesario.
        </p>
      </section>

      <aside class="nota">
        <strong>Nota sobre el proyecto</strong>
        <p>
          Sanidad Teis es un proyecto didáctico. Este texto tiene carácter
          informativo y no constituye asesoramiento jurídico ni sustituye un
          aviso legal revisado para una entidad o actividad real.
        </p>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.aviso-legal {
  width: min(900px, 100%);
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4.5rem) clamp(1rem, 4vw, 3rem);
  box-sizing: border-box;
}

.cabecera,
.contenido {
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.cabecera {
  padding: clamp(1.75rem, 4vw, 3rem);
  text-align: center;
  border-radius: 16px 16px 0 0;
  border-bottom: 3px solid var(--accent);
}

.etiqueta {
  color: var(--accent-dark);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.cabecera h1 {
  margin: 0.5rem 0;
  color: var(--text-h);
  font-size: clamp(2rem, 5vw, 3rem);
}

.introduccion {
  max-width: 38rem;
  margin: 0 auto;
  line-height: 1.6;
}

.contenido {
  padding: clamp(1.5rem, 4vw, 3rem);
  border-top: 0;
  border-radius: 0 0 16px 16px;
}

.contenido section + section {
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.contenido h2 {
  margin: 0 0 0.6rem;
  color: var(--text-h);
  font-size: 1.2rem;
}

.contenido p {
  margin: 0;
  line-height: 1.75;
}

.nota {
  margin-top: 2rem;
  padding: 1.25rem 1.5rem;
  background: var(--surface-muted);
  border-left: 4px solid var(--accent);
  border-radius: 0 8px 8px 0;
  line-height: 1.6;
}

.nota strong {
  display: block;
  margin-bottom: 0.35rem;
  color: var(--text-h);
}
</style>
