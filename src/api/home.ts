import service from "../utils/https";

// 获得轮播图
export function getBanner(): Promise<Banners> {
    return service({
        url: '/banner?type=0',
        method: 'GET'
    })
}

// get Recommend the playlist
export function getRecPlayList(): Promise<RecPlayList> {
    return service({
        url: '/personalized?limit=10',
        method: 'get'
    })
}


/// get recommend the artists
export function getRecArtists(): Promise<Artists> {
    return service({
        url: '/top/artists?offset=0&limit=6',
        method: 'get'
    })
}

//get new album
export function getNewAlbum(area: string, limit: number, offset: number): Promise<Album> {
    return service({
        url: `/album/new?area=${area}&limit=${limit}&offset=${offset * limit}`,
        method: 'get'
    })
}

//get toplist
export function getTopList(): Promise<TopListData> {
    return service({
        url: '/toplist',
        method: 'get'
    })
}
export function getPlayListTrack(id: number, limit: number): Promise<SongData> {
    return service({
        url: `/playlist/track/all?id=${id}&limit=${limit}&offset=0`,
        method: 'get'
    })
}

export function getMVList(area: string): Promise<MVData> {
    return service({
        url: `/mv/first?limit=10&area=${area}`,
        method: 'get'
    })
}

// Get the recommended category playlist
export function getReccategoryPlayList(limit: number, cat: string, offset: number): Promise<ReccategoryPlayList> {
    return service({
        url: `/top/playlist?limit=${limit}&cat=${cat}&offset=${offset * limit}`,
        method: 'get'
    })
}

// get daily recommend songs
export function getDailyRecommendSongs() {
    return service({
        url: `/recommend/songs`,
        method: 'get'
    })
}

//get personal FM
export function getPersonalFm() {
    return service({
        url: `/personal_fm`,
        method: 'get'
    })
}