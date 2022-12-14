import service from "@/utils/https";

// sub playlist
export function subPlaylist(t: number, listid: number, id: number) {
    return service({
        url: `/playlist/subscribe?t=${t}&id=${listid}&uid=${id}`,
        method: "get"
    })
}

// get use playlist
export function getUserPlaylist(id: number) {
    return service({
        url: `/user/playlist?uid=${id}`,
        method: "get"
    })
}

// get user like art list
export function getUserArtlist(id: number) {
    return service({
        url: `/artist/sublist?uid=${id}`,
        method: "get"
    })
}

// get user like MV list
export function getUserMV(id: number) {
    return service({
        url: `/mv/sublist?uid=${id}`,
        method: "get"
    })
}

// sub artist   1:为收藏 其他为取消
export function subArtist(artId: number, t: number, id: number) {
    return service({
        url: `/artist/sub?id=${artId}&t=${t}&uid=${id}`,
        method: "get"
    })
}

//sub MV 1:为收藏 其他为取消
export function subMV(mvid: number, t: number, id: number) {
    return service({
        url: `/mv/sub?mvid=${mvid}&t=${t}&uid=${id}`,
        method: "get"
    })
}

//get user like album
export function getUserAlbum(id: number) {
    return service({
        url: `/album/sublist?uid=${id}`,
        method: "get"
    })
}

//sub album 1:为收藏 其他为取消
export function subAlbum(albumid: number, t: number, id: number) {
    return service({
        url: `/album/sub?id=${albumid}&t=${t}&uid=${id}`,
        method: "get"
    })
}

// like song
export function likeSong(songid: number, id: number) {
    return service({
        url: `/like?id=${songid}&uid=${id}`,
        method: "get"
    })
}

// get like song list
export function getLikeSonglist(id: number) {
    return service({
        url: `/likelist?uid=${id}`,
        method: "get"
    })
}