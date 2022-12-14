import service from "@/utils/https";

//get mv url
export function getMVUrl(id: any) {
    id = Number(id)
    return service({
        url: `/mv/url?id=${id}`,
        method: 'get'
    })
}

// get all mv
export function getAllMV(area: string, type: string, order: string, offset: number) {
    return service({
        url: `/mv/all?area=${area}&type=${type}&order=${order}&offset=${offset * 20}`,
        method: 'get'
    })
}

// get mv detail 
export function getMVDetail(id: any) {
    id = Number(id)
    return service({
        url: `/mv/detail?mvid=${id}`,
        method: 'get'
    })
}

// get artist mv
export function getArtistMV(id: any, limit: number, offset: number) {
    id = Number(id)
    return service({
        url: `/artist/mv?id=${id}&limit=${limit}&offset=${offset * limit}`,
        method: 'get'
    })
}