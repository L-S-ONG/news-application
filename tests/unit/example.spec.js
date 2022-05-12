// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'

// Components
import App from '@/App.vue'

// Utilities
import {
  createLocalVue,
  shallowMount,
} from '@vue/test-utils'

Vue.use(Vuetify)
const localVue = createLocalVue()
localVue.use(Vuex)

describe('App.vue', () => {
  let vuetify
  let actions
  let store

  beforeEach(() => {
    actions = {
      "news/retrieveHeadlines": jest.fn(),
      "news/retrieveSources": jest.fn(),
    }

    store = new Vuex.Store({
      state: {},
      actions
    })
    vuetify = new Vuetify()
  })

  it('renders a snapshot', () => {
    const wrapper = shallowMount(App, {
      localVue,
      store,
      vuetify,
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})