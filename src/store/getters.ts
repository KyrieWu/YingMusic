import { IState } from './state'

export default {
    getCurrentSongId: (state: IState) => {
        if (state.playIndex >= 0) {
            return state.playList[state.playIndex]?.id
        }
    }
}