<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>Crown's Dilemma</strong> (v{{ version }}) by Pelle Koster. The
        <a href="https://github.com/elfjes/crowns-dilemma">source code</a> is licensed
        <a href="https://opensource.org/licenses/mit-license.php">MIT</a>. &nbsp;&bull;
        <a href="https://crowns-dilemma.readthedocs.io/">Documentation</a>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  computed: {
    version() {
      return process.env.VUE_APP_VERSION;
    }
  }
};
</script>

<style scoped></style>
