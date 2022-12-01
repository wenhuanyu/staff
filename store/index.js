import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import template from './modules/template.js'
import customer from './modules/customer.js'

const store = new Vuex.Store({
	modules: {
		template,
		customer
	}
})

export default store