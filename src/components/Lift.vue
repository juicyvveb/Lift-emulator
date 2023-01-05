<template>
  <div :class="{ lift: true, 'lift--wait': wait }" :style="{
    height: `${height}px`,
    transform: `translateY(${-100 * (current - 1)}%)`,
  }">
    <div class="lift__indicator" v-if="work">
      <div :class="{
        lift__arrow: work,
        'lift__arrow--down': down,
        'lift__arrow--up': up,
      }"></div>
      <div class="lift__target">{{ target }}</div>
    </div>
  </div>
</template>

<script>
import { saveLocalStorage, getLocalStorage } from '../api/localStorage';

export default {
  props: {
    height: Number,
    work: Boolean,
    target: Number, //target level
    id: Number,
  },
  data() {
    return {
      current: getLocalStorage(`lift_${this.id}`) || 1, //get position from LS or generate default 1 level
      wait: false, // if lift is holding on
      hold_time: 3000, //time for hold on
      speed_time: 1000, //time to get one level
      up: false, //if it moves up
      down: false, //if it moves down
    };
  },
  methods: {
    move() {
      //process of lift's moving
      if (this.current < this.target) {
        //lift moves up
        setTimeout(() => {
          this.current++;
          this.move();
        }, this.speed_time);
      }

      if (this.current > this.target) {
        //lift moves down
        setTimeout(() => {
          this.current--;
          this.move();
        }, this.speed_time);
      }

      if (this.current == this.target) {
        //lift's arrived
        setTimeout(() => {
          this.$emit('arrived', { id: this.id, current: this.current }); //gives a signal to note current level and starts holding on
          this.wait = true;
        }, this.speed_time);

        new Promise((res) => {
          setTimeout(() => {
            res(); //hold on
          }, this.hold_time);
        }).then(() => {
          this.wait = false; //end of holding on
          this.down = this.up = false; //reset moving indicators
          this.$emit('complete', this.id); //give a signal being ready for next call
          return;
        });
      }
    },
  },
  watch: {
    target(n) {
      //takes a signal to move
      this.move();
      this.current > n ? (this.down = true) : (this.up = true); //set moving indicator
    },
    current() {
      //current changes - set to LS
      saveLocalStorage(`lift_${this.id}`, JSON.stringify(this.current));
    },
  },
};
</script>

<style lang="scss" scoped>
$borderRadius: 10px;

.lift {
  width: 100%;
  background: rgb(96, 222, 245);
  border: 1px solid black;
  display: inline-block;
  transition: all 0.5s linear;
  border-top-left-radius: $borderRadius;
  border-top-right-radius: $borderRadius;
  box-sizing: border-box;
  overflow: hidden;

  &--wait {
    animation: waiting 0.8s linear infinite;
  }

  &__indicator {
    position: absolute;
    left: 35%;
    top: 5%;
    width: 40%;
    padding: 4px;
    display: inline-flex;
    background-color: white;
  }

  &__target {
    margin-left: auto;
  }

  &__arrow {
    width: 1vw;
    aspect-ratio: 1/1;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 1;
    background-image: url('../assets/arrow.png');

    &--down {
      transform: rotate(180deg);
    }
  }
}

@keyframes waiting {
  50% {
    background-color: rgb(202, 88, 88);
  }
}
</style>
