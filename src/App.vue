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

    <Shaft
      :levels="levels_count"
      :level_height="level_height"
      :lifts_count="lifts_count">
    </Shaft>
  </main>
</template>

<script>
  import Shaft from './components/Shaft.vue';
  import { saveLocalStorage, getLocalStorage } from './api/localStorage';

  export default {
    components: { Shaft },
    data() {
      return {
        levels_count: getLocalStorage('levels') || 5,
        lifts_count: getLocalStorage('lifts') || 2,
        level_height: 100,
      };
    },
    watch: {
      lifts_count(n) {
        saveLocalStorage('lifts', n);
      },
      levels_count(n) {
        saveLocalStorage('levels', n);
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
