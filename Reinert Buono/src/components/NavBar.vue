<template>
  <nav class="navbar">
    <div class="logo">
      <!-- logo: corazón vermello cunha cruz branca dentro (decorativo: o nome xa vai ao lado) -->
      <svg class="logo-icona" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="#e63946"
          stroke="white"
          stroke-width="1"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
        <rect x="10.75" y="6.5" width="2.5" height="8" fill="white" />
        <rect x="8" y="9.25" width="8" height="2.5" fill="white" />
      </svg>
      Sanidad Teis
    </div>

    
    <button class="hamburger" @click="isOpen = !isOpen">☰</button> 

    <ul :class="['menu', { open: isOpen }]">
      <li><RouterLink to="/">Inicio</RouterLink></li>
      <li><RouterLink to="/xestion-pacientes">Pacientes</RouterLink></li>
      <li><RouterLink to="/xestion-doctores">Doctores</RouterLink></li>
      <li><RouterLink to="/sobrenos">Sobre nós</RouterLink></li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from "vue" // será boolean
const isOpen = ref(false) // actívase cuando fago click
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem 6rem;
  background: var(--accent); /* verde da paleta: o texto branco ten contraste 5:1 */
  color: white;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: bold;
  font-size: 1rem;
}

.logo-icona {
  width: 1.6em;
  height: 1.6em;
}

.menu {
  display: flex;
  gap: 0.8rem;
  list-style: none;
}

.menu a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.menu a.router-link-active {
  border-bottom: 0.2rem solid var(--accent-light);
}

/* foco visible ao navegar co teclado */
.menu a:focus-visible {
  outline: 3px solid var(--accent-light);
  outline-offset: 2px;
}

/* NUEVO */
.hamburger {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
}

/* NUEVO (responsive) */
@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .menu {
    display: none;
    position: absolute;
    top: 50px;
    right: 0;
    flex-direction: column;
    background: var(--accent);
    padding: 1rem;
  }

  .menu.open {
    display: flex;
  }
}
</style>
