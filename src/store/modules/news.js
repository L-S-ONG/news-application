/* eslint-disable linebreak-style */

import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';

const getters = {
  getSources(state) {
    return state.sources;
  },
  getHeadlines(state) {
    return state.news;
  },
  getLoading(state) {
    return state.loading;
  },
  getErrorDialog(state) {
    return state.errorDialog;
  }
};

const mutations = {
  setSources(state, value) {
    state.sources = value;
  },
  setHeadlines(state, value) {
    state.news = value;
  },
  setLoading(state, value) {
    state.loading = value;
  },
  setErrorDialog(state, value) {
    state.errorDialog = value;
  }
};

const actions = {
  initError ({ commit }, value) {
    commit('setErrorDialog', value);
  },
  async retrieveSources({ commit }) {
    try {
      const response = await axios.get(
        'https://newsapi.org/v2/sources?apiKey=099148be22804e849a0c6fe022b7cf5e'
      );

      if (response.status === 200) {
        commit('setSources', response.data.sources);
      }
    } catch (error) {
      //
      commit('setErrorDialog', true);
    }
  },
  async retrieveHeadlines({ commit }, { q, sources }) {
    let country = '';
    if (!(q || sources)) {
      country = 'us';
    }
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?apiKey=099148be22804e849a0c6fe022b7cf5e`,
        {
          params: {
            q,
            sources,
            country
          }
        }
      );

      if (response.status === 200) {
        for (let i = 0; i < response.data.articles.length; i++) {
          const givenDatetime = response.data.articles[i].publishedAt;
          // define the format
          const fmt = 'DD MMM YYYY, hh:mm A';
          // parse input string as UTC, using that format
          const m = moment(givenDatetime).utc(givenDatetime, fmt);
          const fmtTimeZone = moment.tz(m, this.timeZone);
          // create the output string in the same format
          response.data.articles[i].publishedAt = fmtTimeZone.format(fmt);
        }
        commit('setLoading', false);
        commit('setHeadlines', response.data.articles);
      }
    } catch (error) {
      //
      commit('setErrorDialog', true);
    }
  }
};

const state = {
  selectedArticles: {
    source: {
      id: '',
      name: ''
    },
    author: '',
    title: '',
    description: ''
  },
  news: [],
  sources: [],
  loading: true,
  errorDialog: false
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
