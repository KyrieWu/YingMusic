import service from "@/utils/https";

// get mp3
export function getMp3(id: number) {
    return service({
        url: `/song/url/v1?id=${id}&level=standard`,
        method: 'get'
    })
}

//get song detail
export function getSongDetail(...ids: any) {
    return service({
        url: `song/detail?ids=${ids}`,
        method: 'get'
    })
}

// get the lyrics
export function getLyric(id: any) {
    id = Number(id)
    return service({
        url: `/lyric?id=${id}`,
        method: 'get'
    })
}


// chunk song
export function checkMusic(id: any) {
    id = Number(id)
    return service({
        url: `/check/music?id=${id}`,
        method: 'get'
    })
}