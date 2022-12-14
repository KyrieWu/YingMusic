import service from "@/utils/https";


// get altum detail
export function getAltumDetail(id: any) {
    id = Number(id)
    return service({
        url: `/album?id=${id}`,
        method: 'get'
    })
}

// get art album
export function getArtAlbum(id: any, limit: number, offset: number) {
    id = Number(id)
    return service({
        url: `/artist/album?id=${id}&limit=${limit}&offset=${offset * limit}`,
        method: 'get'
    })
}