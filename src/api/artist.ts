import service from "@/utils/https";


// get artist detail
export function getArtistDetail(id: any) {
    id = Number(id)
    return service({
        url: `/artist/detail?id=${id}`,
        method: 'get'
    })
}

// get artist hot song
export function getArtistHotSong(id: any) {
    id = Number(id)
    return service({
        url: `/artists?id=${id}`,
        method: 'get'
    })
}

//get category artist
export function getCateArtist(type: number, area: number, initial: string, offset: number) {
    return service({
        url: `/artist/list?type=${type}&area=${area}&initial=${initial}&offset=${offset * 20}`,
        method: 'get'
    })
}

//get simi artist
export function getSimitArtist(id: any) {
    id = Number(id)
    return service({
        url: `/simi/artist?id=${id}`,
        method: 'get'
    })
}

//get art all songs
export function getArtistAllSongs(id: any, offset: number) {
    id = Number(id)
    return service({
        url: `/artist/songs?id=${id}&limit=30&offset=${offset * 30}&order=hot`,
        method: 'get'
    })
}