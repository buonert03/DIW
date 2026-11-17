<template>
  <div id="app">
    <!-- Elementos compartidos: navegación, vista seleccionada por la ruta y pie de página. -->
    <NavBar />
    <router-view />
    <FooTer />
  </div>
</template>

<script setup>
  // El componente raíz mantiene visibles la navegación y el pie en todas las rutas.
  import NavBar from './components/NavBar.vue'
  import FooTer from './components/FooTer.vue'
</script>

<style>
/* Estilos globales del contenedor que estructura las vistas de la aplicación. */
body {
  margin: 0;
}

#app {
  max-width: 80vw;
  margin: 0 auto;
  padding-top: 1rem;
  padding-bottom: 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

</style>
