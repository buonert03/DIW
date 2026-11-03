<template>
  <footer class="footer-content footer">
    <div class="link-aviso">
      <router-link to="/avisolegal">Aviso Legal</router-link>
      <span>  © {{ new Date().getFullYear() }} Sanidad Teis — Desenvolvido en Vue 3 por </span>
      <a
        href="https://github.com/P5tyos"
        target="_blank"
        rel="noopener"
        aria-label="Gergely Horvath en GitHub (abre en una nueva pestaña)"
      > Gergely Horvath </a>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer {
  background: var(--accent); /* verde da paleta: o texto branco ten contraste 5:1 */
  color: white;
  text-align: center;
  padding: 0.2rem 6rem;
  margin-top: 3rem;
  font-size: 0.9rem;
}

.link-aviso {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin: 6px 0 1rem; /* mesmo espazo que tiña cando era <ul> */
  color: white;
}

.link-aviso a {
  color: var(--accent-soft); /* verde moi claro: contraste 4.5:1 sobre o footer */
  cursor: pointer;
}

.link-aviso a:visited {
  color: var(--accent-soft);
}

.link-aviso a:hover {
  color: #ffffff;
}

/* foco visible ao navegar co teclado */
.link-aviso a:focus-visible {
  outline: 3px solid var(--accent-light);
  outline-offset: 2px;
}
</style>
