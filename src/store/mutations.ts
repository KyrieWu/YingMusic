import { IState } from './state'
import { setToken, removeToken } from '@/utils/token'

export default {
    GETBANNER(state: IState, banners: BannerInfo[]) {
        state.banners = banners
    },
    // GETSONGID(state: IState, songurl: string) {
    //     state.songUrl = songurl
    // },
    PLAYSONG(state: IState, song: SongInfo) {
        if (state.playList.length > 0 && state.playList.includes(song)) {
            let index = state.playList.indexOf(song)
            state.playIndex = index
        } else {
            let list: SongInfo[] = []
            if (state.playList.length > 0) {
                list = state.playList
            }

            list.unshift(song)
            state.playList = list
            state.playIndex = 0
            state.showPlayerBar = true
        }
    },

    ADDTOPLAYLIST(state: IState, song: SongInfo) {
        if (!state.playList.includes(song)) {
            let list: SongInfo[] = []
            list = state.playList

            list.unshift(song)
            state.playList = list
            state.playIndex = state.playIndex + 1
            state.showPlayerBar = true
        }
    },

    UPDATEPLAYLIST(state: IState, list: SongInfo[]) {
        state.playList = list
        state.playIndex = 0
        state.showPlayerBar = true
    },

    UPDTAEPLAYINDEX(state: IState, index: number) {
        state.playIndex = index
    },
    GETCATEPLAYLIST(state: IState, list: CatePlayListInfo[]) {
        state.catePlayLists = list
    },
    UPDATECAT(state: IState, cat: string) {
        state.cat = cat
    },
    UPDATECURRENTTINE(state: IState, time: any) {
        state.currentTime = time
    },
    UPDATEDURATION(state: IState, time: any) {
        state.duration = time
    },
    DELETEALLPLAYLIST(state: IState) {
        state.playList = []
    },
    SHOWPLAYERBAR(state: IState, isShow: boolean) {
        state.showPlayerBar = isShow
    },
    GETLYRIC(state: IState, lyric: any) {
        state.lyriclist = lyric
    },
    DELETESONGFROMPLAYLIST(state: IState, song: SongInfo) {
        if (state.playList.length > 0 && state.playList.includes(song)) {
            let index = state.playList.indexOf(song)
            if (index == state.playIndex) {
                if (index == state.playList.length - 1) {
                    state.playIndex = index - 1
                } else {
                    state.playIndex = index
                }
            }
            state.playList.splice(index, 1)
        }
    },
    SEARCHSONGSLIST(state: IState, result: any[]) {
        state.searchSongsList = result
    },
    SEARCHALBUMSLIST(state: IState, result: any[]) {
        state.searchAlbumList = result
    },
    SEARCHARTISTLIST(state: IState, result: any[]) {
        state.searchArtistList = result
    },
    SEARCHPLAYLIST(state: IState, result: any[]) {
        state.searchPlaylist = result
    },
    SEARCHMVLIST(state: IState, result: any[]) {
        state.searchMVlist = result
    },
    UPDATEKEYWORD(state: IState, keyWord: string) {
        state.keyword = keyWord
    },
    UPDATESERCHTYPE(state: IState, type: number) {
        state.searchType = type
    },
    UPDATELOGIN(state: IState, isLogin: boolean) {
        state.isLogin = isLogin
    },
    UPDATETOKEN(state: IState, token: string) {
        state.token = token
        if (token == '') {
            removeToken()
        } else {
            setToken(token)
        }
    },
    UPDATEUSER(state: IState, userinfo: Profile) {
        if (Object.keys(userinfo).length == 0) {
            state.user = {} as Profile
            localStorage.removeItem('userinfo')
        } else {
            state.user = Object.assign(state.user, userinfo)
            localStorage.setItem('userinfo', JSON.stringify(state.user))
        }
    },
    UPDATELIKESONGLIST(state: IState, songlist: any[]) {
        state.likeSonglist = songlist
    },
    UPDATELIKEPLAYLIST(state: IState, playlist: CatePlayListInfo[]) {
        state.likePlaylist = playlist
    },
    UPDATELIKEALBUMLIST(state: IState, albumlist: any[]) {
        state.likeAlbumlist = albumlist
    },
    UPDATELIKEMVLIST(state: IState, mvlist: any[]) {
        state.likeMVlist = mvlist
    },
    UPDATELIKEARTISTLIST(state: IState, artistlist: any[]) {
        state.likeArtistlist = artistlist
    },
    UPDATEDAILYSONGSLIST(state: IState, songlist: any[]) {
        state.dailyRecommendSongs = songlist
    }
}