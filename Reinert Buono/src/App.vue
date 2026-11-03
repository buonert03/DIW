<template>
  <div id="app">
    <NavBar />
    <!-- Aquí se carga el router-view -->
    <router-view />
    <FooTer />
  </div>
</template>

<script setup>
  import NavBar from './components/NavBar.vue'
  import FooTer from './components/FooTer.vue'
  //import { RouterView } from 'vue-router'
</script>

<style>
/* 👇 Estilos globales mínimos */
body {
  margin: 0;               /* quita el margen por defecto del body */
}

#app {
  max-width: 80vw;
  margin: 0 auto;          /* centra horizontalmente */
  padding-top: 1rem;       /* 🔹 margen superior pequeño */
  padding-bottom: 1rem;    /* 🔹 espacio para el futuro footer */
  min-height: 100vh;       /* ocupa toda la altura de la pantalla */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* el contenido empieza arriba */
}
/* Cuando la pantalla es menor a 768px */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}

</style>
