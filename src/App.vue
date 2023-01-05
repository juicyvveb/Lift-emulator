<template>
  <main>
    <div class="input">
      <h3 class="input__title">Levels' count:</h3>
      <input
        class="input__input"
        type="number"
        :value="levels_count"
        placeholder="count of levels"
        @input="handleLevelsCount" />
    </div>

    <div class="input">
      <h3 class="input__title">Lifts' count:</h3>
      <input
        type="number"
        :value="lifts_count"
        placeholder="count of lifts"
        @input="handleLiftsCount" />
    </div>
  </main>
</template>

<script>

  export default {
    data() {
      return {
        levels_count:  5,
        lifts_count: 2,
        level_height: 100,
      };
    },
    watch: {
      lifts_count(n) {
        console.log(n)
      },
      levels_count(n) {
        console.log(n)
      },
    },
    methods: {
      handleLevelsCount(e) {
        this.levels_count = +e.target.value;
      },
      handleLiftsCount(e) {
        this.lifts_count = +e.target.value;
      },
    },
  };
</script>

<style scoped lang="scss">
  main {
    display: flex;
    flex-wrap: wrap;
    min-width: 1000px;
  }
  .input {
    margin-right: 5%;
  }
</style>
