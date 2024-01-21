<script>
import cell from '@/components/CellComponent.vue'
export default {
  components: { cell },
  name: 'HomeView',
  data() {
    return {
      cells: [],
      score: 0
    }
  },
  methods: {
    addCell(ref) {
      this.cells.push(ref)
    },

    updateScore(value) {
      this.score += value
    },

    resetGame() {
      this.cells.forEach((cell) => {
        cell.value = null
      })
      this.addTile()
      this.addTile()
      this.addEvent()
    },

    addTile() {
      const empty_cells = this.emptyCells
      if (empty_cells.length > 0) {
        const random_index = Math.floor(Math.random() * empty_cells.length)
        empty_cells[random_index].value = Math.random() >= 0.5 ? 2 : 4
      }
    },

    slideTiles(groupCells) {
      groupCells.forEach((group) => this.slideTilesInGroup(group))
      this.cells.forEach((cell) => {
        if (cell.hasTileForMerge) {
          cell.mergeTile()
        }
      })
    },

    slideTilesInGroup(group) {
      for (let i = 1; i < group.length; i++) {
        if (group[i].value == null) {
          continue
        }

        const active_cell = group[i]
        let target_cell
        let j = i - 1
        while (j >= 0 && group[j].canAccept(active_cell)) {
          target_cell = group[j]
          j--
        }
        if (!target_cell) {
          continue
        } else {
          target_cell.prepareMergeTile(active_cell)
        }
        active_cell.clearTile()
      }
    },

    moveUp() {
      this.slideTiles(this.groupByColumn)
    },

    moveDown() {
      this.slideTiles(this.groupByColumn.map((column) => [...column].reverse()))
    },

    moveLeft() {
      this.slideTiles(this.groupByRow)
    },

    moveRight() {
      this.slideTiles(this.groupByRow.map((column) => [...column].reverse()))
    },

    handleInput(event) {
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          if (!this.canMoveUp) {
            this.addEvent()
            return
          }
          this.moveUp()
          break

        case 'ArrowDown':
        case 's':
          if (!this.canMoveDown) {
            this.addEvent()
            return
          }
          this.moveDown()
          break

        case 'ArrowLeft':
        case 'a':
          if (!this.canMoveLeft) {
            this.addEvent()
            return
          }
          this.moveLeft()
          break

        case 'ArrowRight':
        case 'd':
          if (!this.canMoveRight) {
            this.addEvent()
            return
          }
          this.moveRight()
          break

        default:
          this.addEvent()
          return
      }
      this.addTile()

      if (!this.canMoveUp && !this.canMoveRight && !this.canMoveDown && !this.canMoveLeft) {
        alert('Can`t move.  Try again!')
      } else {
        this.addEvent()
      }
    },

    addEvent() {
      window.addEventListener('keydown', this.handleInput, { once: true })
    }
  },
  computed: {
    emptyCells() {
      return this.cells.filter((cell) => {
        return cell.value == null
      })
    },

    groupByRow() {
      return this.cells.reduce((groupedCells, cell) => {
        groupedCells[cell.y] = groupedCells[cell.y] || []
        groupedCells[cell.y][cell.x] = cell
        return groupedCells
      }, [])
    },

    groupByColumn() {
      return this.cells.reduce((groupedCells, cell) => {
        groupedCells[cell.x] = groupedCells[cell.x] || []
        groupedCells[cell.x][cell.y] = cell
        return groupedCells
      }, [])
    },

    canMoveUp() {
      return this.canMove(this.groupByColumn)
    },
    canMoveDown() {
      return this.canMove(this.groupByColumn.map((column) => [...column].reverse()))
    },
    canMoveLeft() {
      return this.canMove(this.groupByRow)
    },
    canMoveRight() {
      return this.canMove(this.groupByRow.map((column) => [...column].reverse()))
    },
    canMove() {
      return (groupedCells) => {
        return groupedCells.some((group) => this.canMoveInGroup(group))
      }
    },
    canMoveInGroup() {
      return (group) => {
        return group.some((cell, index) => {
          if (index == 0) {
            return false
          }

          if (cell.value == null) {
            return false
          }

          const targetCell = group[index - 1]
          return targetCell.canAccept(cell)
        })
      }
    }
  },
  mounted() {
    this.addEvent()
    this.addTile()
    this.addTile()
  }
}
</script>

<template>
  <div class="game-table">
    <cell
      v-for="i in 16"
      :key="i"
      :cx="(i - 1) % 4"
      :cy="Math.floor((i - 1) / 4)"
      :ref="addCell"
      v-on:updateScore="updateScore"
    />
  </div>
  <div class="menu">
    <div class="menu-main">
      <span class="name">2048 Game</span>
      <br />
      <span class="score">Score: {{ score }}</span>
    </div>
    <hr />
    <div class="menu-buttons">
      <button class="reset" @click="resetGame">reset game</button>
    </div>
    <hr />
    <div class="menu-description">
      <span>Controls</span>
      <div class="controls">
        <div class="control">
          <div class="control-key" style="grid-area: a">w</div>
          <div class="control-key" style="grid-area: b">a</div>
          <div class="control-key" style="grid-area: c">s</div>
          <div class="control-key" style="grid-area: d">d</div>
        </div>
        <div class="control">
          <div class="control-key" style="grid-area: a">&uarr;</div>
          <div class="control-key" style="grid-area: b">&larr;</div>
          <div class="control-key" style="grid-area: c">&darr;</div>
          <div class="control-key" style="grid-area: d">&rarr;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-table {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 20vmin);
  grid-template-rows: repeat(4, 20vmin);
  gap: 1vmin;
}

.reset {
  width: fit-content;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid black;
}

.menu {
  padding: 32px 12px;
  background: inherit;
  box-shadow: 0px 4px 32px 17px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: max-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  &-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .name {
      font-size: 32px;
      font-weight: bold;
    }
    .score {
      border-radius: 8px;
      padding: 8px;
      background: inherit;
      border: 1px solid black;
    }
  }
  &-description {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    .controls {
      display: flex;
      gap: 32px;
      .control {
        display: grid;
        grid-template:
          '. a .' 28px
          'b c d' 28px/ 28px 28px 28px;
        gap: 8px;
        .control-key {
          border: 1px solid black;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
          padding: 8px;
        }
      }
    }
  }
}

hr {
  border-bottom: 2px solid #d7d7d7;
  width: 100%;
  border-radius: 8px;
}
</style>
