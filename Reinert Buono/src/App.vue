<template>
  <div id="app">
    <NavBar />
    <!-- A vista activa determínaa a ruta actual. -->
    <router-view />
    <FooTer />
  </div>
</template>

<script setup>
  import NavBar from './components/NavBar.vue'
  import FooTer from './components/FooTer.vue'
</script>

<style>
/* Estilos globais do contedor principal da aplicación. */
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
