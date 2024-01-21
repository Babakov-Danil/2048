<script>
export default {
  props: ['cx', 'cy'],
  emits: ['updateScore'],
  data() {
    return {
      value: null,
      x: this.cx,
      y: this.cy,
      tileForMerge: null
    }
  },
  methods: {
    clearTile() {
      this.value = null
    },
    prepareMergeTile(cell) {
      if (this.value != null) {
        this.tileForMerge = true
      }
      this.value = cell.value + this.value
    },
    mergeTile() {
      if (this.tileForMerge) {
        this.tileForMerge = null
        this.$emit('updateScore', this.value)
      }
    }
  },
  computed: {
    hasTileForMerge() {
      return !!this.tileForMerge
    },
    canAccept() {
      return (cell) => {
        return this.value == null || (cell.value == this.value && !this.hasTileForMerge)
      }
    },
    getBgColor() {
      const power = Math.log2(this.value)
      const bgLightness = 100 - power * 9
      return 'hsl(150, 50%, ' + bgLightness + '%)'
    },
    getFontColor() {
      const power = Math.log2(this.value)
      const bgLightness = 100 - power * 9
      const fontLightness = bgLightness <= 50 ? '90%' : '10%'
      return 'hsl(150, 25%, ' + fontLightness + ')'
    }
  }
}
</script>

<template>
  <div class="cell"></div>
  <Transition name="bounce">
    <div
      :key="value + Math.random()"
      v-if="value"
      class="tile"
      :style="{
        background: getBgColor,
        color: getFontColor,
        left: 'calc(' + x + '* (20vmin + 1vmin))',
        top: 'calc(' + y + '* (20vmin + 1vmin))'
      }"
    >
      {{ value }}
    </div>
  </Transition>
</template>

<style scoped>
.cell {
  background: gray;
  border: 1px solid #adadad;
  border-radius: 1vmin;
  transition: 800ms;
}

.tile {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20vmin;
  height: 20vmin;
  border-radius: 1vmin;
  //color: black;
  font-size: 32px;
  font-weight: bold;
}
.bounce-enter-active {
  animation: bounce-in 0.4s;
}
.bounce-leave-active {
  animation: bounce-in 0.2s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
