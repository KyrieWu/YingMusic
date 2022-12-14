import { getToken } from '@/utils/token'

export interface IState {
    banners: BannerInfo[],
    playList: SongInfo[],
    playIndex: number,
    catePlayLists: CatePlayListInfo[],
    cat: string,
    currentTime: any,
    duration: any,
    showPlayerBar: boolean,
    lyriclist: object,
    searchSongsList: any[],
    searchAlbumList: any[],
    searchArtistList: any[],
    searchPlaylist: any[],
    searchMVlist: any[],
    searchType: number,
    keyword: string,
    isLogin: boolean,
    user: Profile,
    token: string,
    likeSonglist: any[],
    likePlaylist: CatePlayListInfo[],
    likeAlbumlist: any[],
    likeMVlist: any[],
    likeArtistlist: any[],
    dailyRecommendSongs: SongInfo[],
    setting: {
        lang: string
    }
}


export default {
    banners: [],
    playList: [],
    playIndex: -1,
    catePlayLists: [] as CatePlayListInfo[],
    cat: '',
    currentTime: 0,
    duration: 0,
    showPlayerBar: false,
    lyriclist: {},
    searchSongsList: [],
    searchAlbumList: [],
    searchArtistList: [],
    searchPlaylist: [],
    searchMVlist: [],
    searchType: 1,
    keyword: '',
    isLogin: getToken() ? true : false,
    user: localStorage.getItem('userinfo') ? JSON.parse(`${localStorage.getItem('userinfo')}`) : {} as Profile,
    token: getToken(),
    likeSonglist: [],
    likePlaylist: [] as CatePlayListInfo[],
    likeAlbumlist: [],
    likeMVlist: [],
    likeArtistlist: [],
    dailyRecommendSongs: [] as SongInfo[],
    setting: {
        lang: ''
    }
}