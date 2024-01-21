import { defineStore } from 'pinia'

export const useCounterStore = defineStore('game', {
  state: () => ({
    game_table: null
  }),
  getters: {},
  actions: {}
})
