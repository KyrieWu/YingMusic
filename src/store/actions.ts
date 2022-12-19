import { Commit, Dispatch } from "vuex";
import { getBanner } from "@/api/home";
import { checkMusic, getLyric, getSongDetail } from "@/api/track";
import { IState } from "./state";
import { getReccategoryPlayList } from "@/api/home";
import { search } from "@/api/search";
import { toLogin, getUserInfo, toLogout, checkCaptcha } from '@/api/login'
import { getLikeSonglist, getUserAlbum, getUserArtlist, getUserMV, getUserPlaylist, subAlbum, subArtist, subMV, subPlaylist, likeSong } from '@/api/user'
import { getDailyRecommendSongs } from '@/api/home'
import Message from "@/components/Message/index";

interface Logout {
    code: number
}

interface UserInfo {
    code: number,
    profile: Profile
}

interface LikeSongList {
    code: number,
    ids: number[]
}
interface SongDetail {
    code: number,
    songs: SongInfo[]
}

interface UserPlaylist {
    code: number,
    playlist: CatePlayListInfo[]
}
interface UserAlbum {
    code: number
    count: number
    data: AlbumInfo[]
    hasMore: boolean
    paidCount: number
}
interface UserMV {
    code: number
    count: number
    data: MVInfo[]
    hasMore: boolean
}
interface UserArtist {
    code: number
    count: number
    data: ArtistsInfo[]
    hasMore: boolean
}
interface Sub {
    code: number
}
interface DailyRecommendSongs {
    code: number
    data: {
        dailySongs: SongInfo[]
    }
}


export default {
    async getBanner({ commit, state }: { commit: Commit; state: IState }) {
        let resault = await getBanner();
        if (resault.code == 200) {
            commit("GETBANNER", resault.banners);
        }
    },

    //checkMusic
    async checkMusic(
        { commit }: { commit: Commit },
        id: number
    ): Promise<boolean> {
        let result = (await checkMusic(id)) as unknown as CheckMusic;
        if (result.success == true) {
            return true;
        }
        Message({
            message: '此歌曲暂无版权!',
            type: 'warn'
        })
        return false;
    },

    //  Get  category playlist
    async getCatePlayList(
        { commit }: { commit: Commit },
        { limit, cat }: { limit: number; cat: string }
    ) {
        let result = (await getReccategoryPlayList(
            limit,
            cat,
            0
        )) as unknown as CatePlayLists;
        if (result.code == 200) {
            commit("GETCATEPLAYLIST", result.playlists);
            commit("UPDATECAT", cat);
        }
    },

    // get lyric
    async getLyric({ commit }: { commit: Commit }, id: number) {
        let res = await getLyric(id) as unknown as Lyric;
        if (res.code == 200) {
            commit("GETLYRIC", res.lrc);
        }
    },

    // to search  SEARCHALBUMSLIST SEARCHARTISTLIST SEARCHPLAYLIST SEARCHMVLIST
    async toSearch(
        { commit }: { commit: Commit },
        { keyWord, type }: { keyWord: string; type: number }
    ) {
        commit("UPDATEKEYWORD", keyWord);
        commit("UPDATESERCHTYPE", type);
        let res = (await search(keyWord, type)) as unknown as Search;
        if (res.code === 200) {
            console.log(res)
            if (type == 1) {
                commit("SEARCHSONGSLIST", res.result.songs);
            } else if (type == 10) {
                commit("SEARCHALBUMSLIST", res.result.albums);
            } else if (type == 100) {
                commit("SEARCHARTISTLIST", res.result.artists);
            } else if (type == 1000) {
                commit("SEARCHPLAYLIST", res.result.playlists);
            } else if (type == 1004) {
                commit("SEARCHMVLIST", res.result.mvs);
            }
        }
    },

    // to login  UPDATELOGIN
    async toLogin({ commit }: { commit: Commit },
        { phone, password, captcha }: { phone: string; password: string, captcha: string }) {
        if (captcha) {
            try {
                await checkCaptcha(phone, captcha)
            } catch (err) {
                Message({
                    message: '验证码错误!',
                    type: 'error'
                })
                return
            }
        }

        let res = await toLogin(phone, password, captcha) as unknown as Login
        if (res.code == 200) {
            commit('UPDATELOGIN', true)
            commit('UPDATETOKEN', res.token)
            let res2 = await getUserInfo(Number(res.account.id)) as unknown as UserInfo
            if (res2.code == 200) {
                commit('UPDATEUSER', res2.profile)
            }
            return true
        } else {
            Message({
                message: '账号或密码错误!',
                type: 'error'
            })

            return false
        }
    },
    async toLogout({ commit }: { commit: Commit }) {
        let res = await toLogout() as unknown as Logout
        if (res.code == 200) {
            commit('UPDATELOGIN', false)
            commit('UPDATETOKEN', '')
            commit('UPDATEUSER', {})
        }
    },
    // get like song list UPDATELIKESONGLIST
    async getLikeSongList({ commit, state }: { commit: Commit, state: IState }) {
        let res = await getLikeSonglist(state.user?.userId) as unknown as LikeSongList
        if (res.code == 200) {
            let result = await getSongDetail(...res.ids) as unknown as SongDetail
            if (result.code == 200) {
                commit('UPDATELIKESONGLIST', result.songs)
            }
        }
    },

    // UPDATELIKEPLAYLIST UPDATELIKEALBUMLIST UPDATELIKEMVLIST UPDATELIKEARTISTLIST
    async getLikePlaylist({ commit, state }: { commit: Commit, state: IState }) {
        let res = await getUserPlaylist(state.user?.userId) as unknown as UserPlaylist
        if (res.code == 200) {
            commit('UPDATELIKEPLAYLIST', res.playlist)
        }

    },
    async getLikeAlbumlist({ commit, state }: { commit: Commit, state: IState }) {
        let res = await getUserAlbum(state.user?.userId) as unknown as UserAlbum
        if (res.code == 200) {
            commit('UPDATELIKEALBUMLIST', res.data)
        }

    },
    async getLikeMVlist({ commit, state }: { commit: Commit, state: IState }) {
        let res = await getUserMV(state.user?.userId) as unknown as UserMV
        if (res.code == 200) {
            commit('UPDATELIKEMVLIST', res.data)
        }
    },
    async getLikeArtlist({ commit, state }: { commit: Commit, state: IState }) {
        let res = await getUserArtlist(state.user?.userId) as unknown as UserArtist
        if (res.code == 200) {
            commit('UPDATELIKEARTISTLIST', res.data)
        }
    },
    async LikePlaylist({ commit, state, dispatch }: { commit: Commit, state: IState, dispatch: Dispatch }, { t, listid }: { t: number, listid: number }) {
        let res = await subPlaylist(t, listid, state.user?.userId) as unknown as Sub
        if (res.code == 200) {
            dispatch('getLikePlaylist')
            return res.code
        }
    },

    // UPDATELIKEPLAYLIST UPDATELIKEALBUMLIST UPDATELIKEMVLIST UPDATELIKEARTISTLIST
    async likeSong({ commit, state, dispatch }: { commit: Commit, state: IState, dispatch: Dispatch }, songid: number) {
        let res = await likeSong(songid, state.user?.userId) as unknown as Sub
        if (res.code == 200) {
            dispatch('getLikeSongList')
            return res.code
        }

    },
    async LikeAlbum({ commit, state, dispatch }: { commit: Commit, state: IState, dispatch: Dispatch }, { albumid, t }: { albumid: number, t: number }) {
        let res = await subAlbum(albumid, t, state.user?.userId) as unknown as Sub
        if (res.code == 200) {
            dispatch('getLikeAlbumlist')
            return res.code
        }

    },
    async LikeMV({ commit, state, dispatch }: { commit: Commit, state: IState, dispatch: Dispatch }, { mvid, t }: { mvid: number, t: number }) {
        let res = await subMV(mvid, t, state.user?.userId) as unknown as Sub
        if (res.code == 200) {
            dispatch('getLikeMVlist')
            return res.code
        }
    },
    async LikeArt({ commit, state, dispatch }: { commit: Commit, state: IState, dispatch: Dispatch }, { artid, t }: { artid: number, t: number }) {
        let res = await subArtist(artid, t, state.user?.userId) as unknown as Sub
        if (res.code == 200) {
            dispatch('getLikeArtlist')
            return res.code
        }
    },
    // get daily recommend songs
    async getDailyRecommendSongs({ commit }: { commit: Commit }) {
        let res = await getDailyRecommendSongs() as unknown as DailyRecommendSongs
        if (res.code == 200) {
            commit('UPDATEDAILYSONGSLIST', res.data.dailySongs)
        }
    }
};
