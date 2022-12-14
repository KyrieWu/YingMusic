import { createStore } from 'vuex'

import state, { IState } from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default createStore<IState>({
    state,
    actions,
    mutations,
    getters
})