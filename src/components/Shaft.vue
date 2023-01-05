<template>
  <div
    class="shaft"
    :style="{ height: `${levels * level_height}px` }">
    <div class="levels">
      <div
        class="levels__item"
        v-for="(level, i) in array"
        :key="i"
        :style="{ height: `${level_height}px` }"></div>
    </div>

    <div
      class="shaft__item"
      v-for="(lift, i) in lifts"
      :key="i">
    </div>
  </div>

  <div
    class="buttons"
    :style="{ height: `${levels * level_height}px` }">
    <button
      :class="{
        buttons__item: true,
        'buttons__item--current': currents.includes(button),
        'buttons__item--target': targets.includes(button),
        'buttons__item--stack': stack.includes(button),
      }"
      v-for="(button, i) in array"
      :key="i"
      @click="handleClick(button)">
      {{ button }}
    </button>
  </div>
</template>

<script>
  function commonLift(id) {
    //creates a common  Lift with current position:1
    return {
      id: id,
      free: true,
      current: +JSON.parse(localStorage.getItem(`lift_${id}`)) || 1,
    };
  }

  function closestByCurrent(arr, target) {
    //detectes the closest lift from lifts that are free by it's current positions
    return arr.sort(
      (a, b) => Math.abs(a.current - target) - Math.abs(b.current - target)
    );
  }

  export default {
    props: {
      levels: Number,
      level_height: Number,
      lifts_count: Number,
    },
    data() {
      return {
        stack: [],
        lifts: [...Array(this.lifts_count)].map((_, i) => commonLift(i)), //initialize start lifts
      };
    },
    computed: {
      array() {
        return [...Array(this.levels)].map((el, i) => i + 1).reverse(); //set of levels_countt
      },
      ready_lifts() {
        return this.lifts.filter((lift) => lift.free); //detect what lifts are free and ready being called
      },
      currents() {
        return this.lifts.map((el) => el.current); //currents positions of lifts
      },
      targets() {
        return this.lifts.map((el) => el?.target); //the targets of each lift
      },
    },
    methods: {
      handleClick(button) {
        if (!this.stack.includes(button) && !this.currents.includes(button)) {
          this.stack = [...this.stack, button];
        }
      },
      activate() {
        //by stack changing this function is called, that checks if some lift is free, if yes, than gives it target and changes it's status
        if (this.ready_lifts.length) {
          let active = closestByCurrent(this.ready_lifts, this.stack[0])[0]; //the closest lift to target
          active.target = this.stack[0]; //give target to the lift
          active.free = false; //change it's status
          this.clearCurrent(active.id); //remove it's current
          this.stack.shift(); //remove this target from stack
        }
      },
      clearCurrent(id) {
        //remove one of currents position by starting move
        this.lifts.filter((el) => el.id == id)[0].current = null;
      },
      handleArrive(val) {
        this.lifts.filter((el) => el.id == val.id)[0].current = val.current; //lift's arrived. add it's current position to array
      },
      complete(id) {
        //signal this lift is ready to being call
        this.lifts.filter((el) => el.id == id)[0].free = true;
        if (this.stack.length) {
          this.activate();
        }
      },
    },
    watch: {
      stack() {
        this.activate();
      },
      lifts_count(n) {
        if (n > this.lifts.length) {
          this.lifts.push(commonLift(n - 1));
        }
        if (n < this.lifts.length && n >= 1) {
          this.lifts.pop();
          localStorage.removeItem(`lift_${n}`);
        }
      },
      levels(n) {
        this.lifts.map((el) => {
          //if levels' count deacrease and there above retain some lift
          if (el.current > n) {
            el.target = n;
          }
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .shaft {
    width: 80%;
    flex-grow: 2;
    background: rgb(238, 233, 213);
    position: relative;
    margin-top: 3%;
    display: flex;
    overflow: hidden;

    &__item {
      min-width: 100px;
      padding: 0 1%;
      display: inline-flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;
      border-right: 1px solid rgb(112, 112, 112);
      border-left: 1px solid (112, 112, 112);
    }

    .levels {
      position: absolute;
      width: 100%;
      &__item {
        width: 100%;
        border: 2px solid black;
        border-bottom: none;

        &:last-child {
          border-bottom: 2px solid black;
        }
      }
    }
  }

  .buttons {
    width: 10%;
    margin-top: 3%;
    display: flex;
    flex-direction: column;
    padding: 0 1rem;
    height: 100%;
    justify-content: space-around;

    &__item {
      margin-bottom: 10%;
      width: 50%;
      aspect-ratio: 1/1;
      padding: 0.3rem;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease-in-out;

      &:hover {
        transform: scale(1.08);
      }

      &--stack {
        background: rgb(240, 243, 62);
      }
      &--target {
        background: rgb(255, 188, 44);
      }
      &--current {
        background: rgb(131, 236, 137);
      }
    }
  }
</style>
