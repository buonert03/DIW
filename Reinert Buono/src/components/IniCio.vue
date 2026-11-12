<template>
  <main class="inicio">
    <video
      class="consulta-medica"
      src="../assets/8460075-hd_1920_1080_24fps.mp4"
      autoplay
      muted
      loop
      playsinline
      aria-label="Vídeo de una consulta médica"
    ></video>
  </main>
</template>

<style scoped>
.inicio {
  display: grid;
  min-height: 70vh;
  place-items: center;
  padding: 1.5rem;
  box-sizing: border-box;
}

.consulta-medica {
  display: block;
  width: min(100%, 640px);
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border: 1px solid var(--border);
  border-radius: 1rem;
  box-shadow: var(--shadow);
}
</style>
