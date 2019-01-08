import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    albums: [],
    searchFailed: false,
    recentSearch: [],
    showRecentSearch: false
  },
  getters: {
    GET_RECENT_SEARCH (state) {
      return state.recentSearch
    }
  },
  mutations: {
    SET_ALBUM (state, data) {
      state.albums = data
    },
    SEARCH_FAILED (state) {
      state.searchFailed = true
    },
    SET_RECENT_SEARCH (state, data) {
      state.recentSearch = data
    },
    CLEAR_SEARCH (state) {
      state.albums = []
    }

  },
  actions: {
    SEARCH_ALBUMS ({ commit, dispatch }, payload) {
      return axios.get(`https://itunes.apple.com/search?term=${payload}&entity=album`)
        .then((response) => {
          if (response.data.results.length === 0) {
            commit('CLEAR_SEARCH')
            commit('SEARCH_FAILED')
          } else {
            commit('SET_ALBUM', response.data.results)

            setTimeout(() => {
              dispatch('SAVE_TO_RECENT_SEARCH', payload)
            }, 3000)
          }
        })
        .catch(() => {
          commit('CLEAR_SEARCH')
          commit('SEARCH_FAILED')
        })
    },
    SAVE_TO_RECENT_SEARCH ({ commit }, payload) {
      let recentSearch = []
      if (localStorage.getItem('recent_search') === null) {
        recentSearch.push(payload)
        localStorage.setItem('recent_search', JSON.stringify(recentSearch))
      } else {
        recentSearch = JSON.parse(localStorage.getItem('recent_search'))
        recentSearch.push(payload)
        localStorage.setItem('recent_search', JSON.stringify(recentSearch))
      }
      commit('SET_RECENT_SEARCH', recentSearch)
    },
    GET_RECENT_SEARCH ({ commit }) {
      const recentSearch = localStorage.getItem('recent_search')
      if (recentSearch !== null) {
        commit('SET_RECENT_SEARCH', JSON.parse(recentSearch))
      }
    }
  }
})
